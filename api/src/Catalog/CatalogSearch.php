<?php

declare(strict_types=1);

namespace Atlas\Api\Catalog;

use Atlas\Api\Domain\Availability;
use Atlas\Api\Domain\Category;
use Atlas\Api\Domain\SortKey;

final class CatalogSearch
{
    private const int RELEVANCE_CONFIDENCE_WEIGHT = 20;
    private const float VERIFIED_BOOST = 0.35;
    private const float DISTANCE_PENALTY_DIVISOR = 400.0;
    private const float PROFESSION_MATCH_BOOST = 2.0;
    private const float NAME_MATCH_BOOST = 1.5;

    /** @return array<string, mixed> */
    public function search(CatalogRepository $repository, CatalogQuery $query): array
    {
        $matched = $this->filter($repository, $query);
        $sorted = $this->sort($repository, $matched, $query);

        $total = count($sorted);
        $totalPages = max(1, (int) ceil($total / $query->perPage));
        $page = min($query->page, $totalPages);
        $offset = ($page - 1) * $query->perPage;

        $items = array_map(
            static fn (array $professional): array => $repository->summary($professional),
            array_slice($sorted, $offset, $query->perPage),
        );

        return [
            'items' => $items,
            'page' => $page,
            'perPage' => $query->perPage,
            'total' => $total,
            'totalPages' => $totalPages,
            'hasMore' => $page < $totalPages,
            'facets' => $this->facets($repository, $query),
        ];
    }

    /** @return list<array<string, mixed>> */
    public function related(CatalogRepository $repository, array $reference, int $limit): array
    {
        $candidates = array_values(array_filter(
            $repository->all(),
            static fn (array $professional): bool => $professional['category'] === $reference['category']
                && $professional['id'] !== $reference['id'],
        ));

        usort($candidates, static function (array $a, array $b) use ($reference): int {
            $distanceA = abs($a['hourlyRate'] - $reference['hourlyRate']) / 100 + abs($a['rating'] - $reference['rating']);
            $distanceB = abs($b['hourlyRate'] - $reference['hourlyRate']) / 100 + abs($b['rating'] - $reference['rating']);

            return $distanceA <=> $distanceB ?: strcmp($a['id'], $b['id']);
        });

        return array_map(
            static fn (array $professional): array => $repository->summary($professional),
            array_slice($candidates, 0, $limit),
        );
    }

    /** @return list<array<string, mixed>> */
    private function filter(CatalogRepository $repository, CatalogQuery $query): array
    {
        $terms = $query->terms();

        $categories = array_map(static fn (Category $category): string => $category->value, $query->categories);
        $availability = array_map(static fn (Availability $item): string => $item->value, $query->availability);

        return array_values(array_filter(
            $repository->all(),
            function (array $professional) use ($repository, $query, $terms, $categories, $availability): bool {
                if ($categories !== [] && !in_array($professional['category'], $categories, true)) {
                    return false;
                }

                if ($availability !== [] && !in_array($professional['availability'], $availability, true)) {
                    return false;
                }

                return $this->matchesTerms($repository, $professional, $terms)
                    && $this->matchesRange($professional, $query);
            },
        ));
    }

    /** @param list<string> $terms */
    private function matchesTerms(CatalogRepository $repository, array $professional, array $terms): bool
    {
        if ($terms === []) {
            return true;
        }

        $haystack = $repository->haystack($professional['id']);

        foreach ($terms as $term) {
            if (!str_contains($haystack, $term)) {
                return false;
            }
        }

        return true;
    }

    private function matchesRange(array $professional, CatalogQuery $query): bool
    {
        if ($query->minPrice !== null && $professional['hourlyRate'] < $query->minPrice) {
            return false;
        }

        if ($query->maxPrice !== null && $professional['hourlyRate'] > $query->maxPrice) {
            return false;
        }

        if ($query->minRating !== null && $professional['rating'] < $query->minRating) {
            return false;
        }

        if ($query->maxDistanceKm !== null && $professional['distanceKm'] > $query->maxDistanceKm) {
            return false;
        }

        return !$query->verifiedOnly || $professional['verified'] === true;
    }

    /**
     * @param list<array<string, mixed>> $matched
     *
     * @return list<array<string, mixed>>
     */
    private function sort(CatalogRepository $repository, array $matched, CatalogQuery $query): array
    {
        if ($query->sort === SortKey::Relevancia) {
            return $this->sortByRelevance($repository, $matched, $query);
        }

        $comparator = match ($query->sort) {
            SortKey::PrecoAsc => static fn (array $a, array $b): int => $a['hourlyRate'] <=> $b['hourlyRate'],
            SortKey::PrecoDesc => static fn (array $a, array $b): int => $b['hourlyRate'] <=> $a['hourlyRate'],
            SortKey::Avaliacao => static fn (array $a, array $b): int => $b['rating'] <=> $a['rating'] ?: $b['reviewsCount'] <=> $a['reviewsCount'],
            SortKey::Distancia => static fn (array $a, array $b): int => $a['distanceKm'] <=> $b['distanceKm'],
            SortKey::Relevancia => static fn (): int => 0,
        };

        usort($matched, static fn (array $a, array $b): int => $comparator($a, $b) ?: strcmp($a['id'], $b['id']));

        return $matched;
    }

    /**
     * @param list<array<string, mixed>> $matched
     *
     * @return list<array<string, mixed>>
     */
    private function sortByRelevance(CatalogRepository $repository, array $matched, CatalogQuery $query): array
    {
        $terms = $query->terms();

        $scored = array_map(
            fn (array $professional): array => [
                'professional' => $professional,
                'score' => $this->relevanceScore($professional, $terms),
            ],
            $matched,
        );

        usort(
            $scored,
            static fn (array $a, array $b): int => $b['score'] <=> $a['score']
                ?: strcmp($a['professional']['id'], $b['professional']['id']),
        );

        return array_column($scored, 'professional');
    }

    /** @param list<string> $terms */
    private function relevanceScore(array $professional, array $terms): float
    {
        $reviews = (int) $professional['reviewsCount'];
        $confidence = $reviews / ($reviews + self::RELEVANCE_CONFIDENCE_WEIGHT);

        $score = $professional['rating'] * $confidence
            + ($professional['verified'] ? self::VERIFIED_BOOST : 0)
            - $professional['distanceKm'] / self::DISTANCE_PENALTY_DIVISOR;

        $profession = Normalizer::text($professional['profession']);
        $name = Normalizer::text($professional['name']);

        foreach ($terms as $term) {
            $score += str_starts_with($profession, $term) ? self::PROFESSION_MATCH_BOOST : 0;
            $score += str_starts_with($name, $term) ? self::NAME_MATCH_BOOST : 0;
        }

        return $score;
    }

    /** @return array<string, mixed> */
    private function facets(CatalogRepository $repository, CatalogQuery $query): array
    {
        $forCategories = $this->filter($repository, $query->withoutCategories());
        $forAvailability = $this->filter($repository, $query->withoutAvailability());

        return [
            'categories' => $this->buckets(Category::cases(), $forCategories, 'category'),
            'availability' => $this->buckets(Availability::cases(), $forAvailability, 'availability'),
            'priceRange' => $repository->priceRange(),
            'maxDistanceKm' => $repository->maxDistanceKm(),
        ];
    }

    /**
     * @param list<Category|Availability> $cases
     * @param list<array<string, mixed>>  $professionals
     *
     * @return list<array<string, mixed>>
     */
    private function buckets(array $cases, array $professionals, string $field): array
    {
        $counts = array_count_values(array_column($professionals, $field));

        return array_map(
            static fn (Category|Availability $case): array => [
                'value' => $case->value,
                'label' => $case->label(),
                'count' => $counts[$case->value] ?? 0,
            ],
            $cases,
        );
    }
}

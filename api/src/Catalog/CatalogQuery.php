<?php

declare(strict_types=1);

namespace Atlas\Api\Catalog;

use Atlas\Api\Domain\Availability;
use Atlas\Api\Domain\Category;
use Atlas\Api\Domain\SortKey;

final readonly class CatalogQuery
{
    public const int DEFAULT_PER_PAGE = 24;
    public const int MAX_PER_PAGE = 48;
    public const int MAX_TERM_LENGTH = 80;
    public const float MAX_DISTANCE_KM = 200.0;

    /**
     * @param list<Category>     $categories
     * @param list<Availability> $availability
     */
    private function __construct(
        public string $term,
        public array $categories,
        public array $availability,
        public ?float $minPrice,
        public ?float $maxPrice,
        public ?float $minRating,
        public ?float $maxDistanceKm,
        public bool $verifiedOnly,
        public SortKey $sort,
        public int $page,
        public int $perPage,
    ) {
    }

    /**
     * @param array<string, mixed> $params
     */
    public static function fromQueryParams(array $params): self
    {
        $minPrice = self::number($params['minPrice'] ?? null);
        $maxPrice = self::number($params['maxPrice'] ?? null);

        $hasRange = $minPrice !== null && $maxPrice !== null;

        return new self(
            term: mb_substr(trim(self::text($params['q'] ?? null)), 0, self::MAX_TERM_LENGTH),
            categories: self::enumList($params['categories'] ?? null, Category::class),
            availability: self::enumList($params['availability'] ?? null, Availability::class),
            minPrice: $hasRange ? min($minPrice, $maxPrice) : $minPrice,
            maxPrice: $hasRange ? max($minPrice, $maxPrice) : $maxPrice,
            minRating: self::clamp(self::number($params['minRating'] ?? null), 0.0, 5.0),
            maxDistanceKm: self::clamp(self::number($params['maxDistanceKm'] ?? null), 0.0, self::MAX_DISTANCE_KM),
            verifiedOnly: in_array(self::text($params['verifiedOnly'] ?? null), ['1', 'true'], true),
            sort: SortKey::tryFrom(self::text($params['sort'] ?? null)) ?? SortKey::Relevancia,
            page: max(1, (int) (self::number($params['page'] ?? null) ?? 1)),
            perPage: min(max(1, (int) (self::number($params['perPage'] ?? null) ?? self::DEFAULT_PER_PAGE)), self::MAX_PER_PAGE),
        );
    }

    public function withoutCategories(): self
    {
        return new self(
            $this->term,
            [],
            $this->availability,
            $this->minPrice,
            $this->maxPrice,
            $this->minRating,
            $this->maxDistanceKm,
            $this->verifiedOnly,
            $this->sort,
            $this->page,
            $this->perPage,
        );
    }

    public function withoutAvailability(): self
    {
        return new self(
            $this->term,
            $this->categories,
            [],
            $this->minPrice,
            $this->maxPrice,
            $this->minRating,
            $this->maxDistanceKm,
            $this->verifiedOnly,
            $this->sort,
            $this->page,
            $this->perPage,
        );
    }

    /** @return list<string> */
    public function terms(): array
    {
        if ($this->term === '') {
            return [];
        }

        return array_values(array_filter(preg_split('/\s+/', Normalizer::text($this->term)) ?: []));
    }

    private static function text(mixed $value): string
    {
        if (is_array($value)) {
            $value = $value[0] ?? '';
        }

        return is_scalar($value) ? (string) $value : '';
    }

    private static function number(mixed $value): ?float
    {
        $raw = self::text($value);

        if ($raw === '' || !is_numeric($raw)) {
            return null;
        }

        return (float) $raw;
    }

    private static function clamp(?float $value, float $min, float $max): ?float
    {
        if ($value === null) {
            return null;
        }

        return min(max($value, $min), $max);
    }

    /**
     * @template T of \BackedEnum
     *
     * @param class-string<T> $enum
     *
     * @return list<T>
     */
    private static function enumList(mixed $value, string $enum): array
    {
        $raw = is_array($value) ? $value : explode(',', self::text($value));

        $parsed = array_filter(array_map(
            static fn (mixed $item): ?object => $enum::tryFrom(trim((string) $item)),
            $raw,
        ));

        return array_values(array_unique($parsed, SORT_REGULAR));
    }
}

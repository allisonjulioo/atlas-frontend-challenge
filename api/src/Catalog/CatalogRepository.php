<?php

declare(strict_types=1);

namespace Atlas\Api\Catalog;

use RuntimeException;

final class CatalogRepository
{
    /** @var list<array<string, mixed>>|null */
    private ?array $professionals = null;

    /** @var array<string, array<string, mixed>>|null */
    private ?array $bySlug = null;

    /** @var array<string, string>|null */
    private ?array $haystacks = null;

    public function __construct(private readonly string $dataPath)
    {
    }

    /** @return list<array<string, mixed>> */
    public function all(): array
    {
        $this->load();

        return $this->professionals ?? [];
    }

    public function findBySlug(string $slug): ?array
    {
        $this->load();

        return $this->bySlug[$slug] ?? null;
    }

    public function haystack(string $id): string
    {
        $this->load();

        return $this->haystacks[$id] ?? '';
    }

    public function count(): int
    {
        return count($this->all());
    }

    /** @return array{min: float, max: float} */
    public function priceRange(): array
    {
        $rates = array_column($this->all(), 'hourlyRate');

        return ['min' => (float) min($rates), 'max' => (float) max($rates)];
    }

    public function maxDistanceKm(): float
    {
        return (float) ceil(max(array_column($this->all(), 'distanceKm')));
    }

    /** @return array<string, mixed> */
    public function summary(array $professional): array
    {
        return array_intersect_key($professional, array_flip([
            'id',
            'slug',
            'name',
            'profession',
            'category',
            'avatarUrl',
            'coverUrl',
            'headline',
            'hourlyRate',
            'rating',
            'reviewsCount',
            'distanceKm',
            'city',
            'state',
            'availability',
            'verified',
        ]));
    }

    private function load(): void
    {
        if ($this->professionals !== null) {
            return;
        }

        $raw = @file_get_contents($this->dataPath);

        if ($raw === false) {
            throw new RuntimeException(sprintf('Dataset não encontrado em %s. Rode composer seed.', $this->dataPath));
        }

        $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);

        $this->professionals = $decoded;
        $this->bySlug = array_column($decoded, null, 'slug');
        $this->haystacks = [];

        foreach ($decoded as $professional) {
            $this->haystacks[$professional['id']] = Normalizer::text(
                $professional['name'] . ' ' . $professional['profession'] . ' ' . $professional['city'],
            );
        }
    }
}

<?php

declare(strict_types=1);

namespace Atlas\Api\Seed;

use Atlas\Api\Support\DeterministicRandom;
use Atlas\Api\Support\Slug;

final readonly class ProfessionalFactory
{
    private const int PORTRAIT_POOL = 100;
    private const float VERIFIED_PROBABILITY = 0.42;
    private const float RATING_FLOOR = 3.4;
    private const float RATING_RANGE = 1.6;
    private const float RATING_CURVE = 0.45;
    private const float DISTANCE_CURVE = 1.8;
    private const float DISTANCE_RANGE = 45.0;
    private const float DISTANCE_FLOOR = 0.4;

    public function __construct(private DeterministicRandom $random)
    {
    }

    /** @return array<string, mixed> */
    public function build(int $index): array
    {
        $profile = $this->random->pick(SeedData::professions());
        $firstName = $this->random->pick(SeedData::firstNames());
        $lastName = $this->random->pick(SeedData::lastNames());
        $name = $firstName . ' ' . $lastName;

        [$city, $state] = $this->random->pick(SeedData::locations());

        $rating = $this->rating();
        $years = $this->random->intBetween(1, 24);
        $completedJobs = $this->random->intBetween(8, 40) * max(1, (int) round($years / 2));
        $position = $index + 1;

        return [
            'id' => sprintf('pro-%04d', $position),
            'slug' => Slug::from($name) . '-' . sprintf('%04d', $position),
            'name' => $name,
            'profession' => $profile['title'],
            'category' => $profile['category'],
            'avatarUrl' => $this->avatarUrl($firstName, $index),
            'coverUrl' => sprintf('https://picsum.photos/seed/atlas-cover-%d/600/800', $position),
            'headline' => $this->random->pick($profile['headlines']),
            'hourlyRate' => $this->random->round($this->random->between($profile['rate'][0], $profile['rate'][1]), 5),
            'rating' => $rating,
            'reviewsCount' => $this->random->intBetween(3, 480),
            'distanceKm' => $this->distance(),
            'city' => $city,
            'state' => $state,
            'availability' => $this->random->pick(['imediata', 'esta-semana', 'agendada']),
            'verified' => $this->random->chance(self::VERIFIED_PROBABILITY),
            'bio' => $this->bio($profile, $years, $city, $completedJobs, $rating),
            'yearsOfExperience' => $years,
            'services' => $this->services($profile),
            'gallery' => $this->gallery($position, $name, $profile['title'], $city),
            'reviews' => $this->reviews($position, $rating),
            'responseTimeMinutes' => $this->random->intBetween(5, 240),
            'completedJobs' => $completedJobs,
            'memberSince' => $this->isoDate(2026 - min($years, 8)),
        ];
    }

    private function rating(): float
    {
        $base = self::RATING_FLOOR + ($this->random->next() ** self::RATING_CURVE) * self::RATING_RANGE;

        return min(5.0, $this->random->round($base, 0.1));
    }

    private function distance(): float
    {
        return $this->random->round(($this->random->next() ** self::DISTANCE_CURVE) * self::DISTANCE_RANGE + self::DISTANCE_FLOOR, 0.1);
    }

    private function avatarUrl(string $firstName, int $index): string
    {
        $gender = array_search($firstName, SeedData::firstNames(), true) < SeedData::FEMALE_NAME_COUNT ? 'women' : 'men';

        return sprintf('https://randomuser.me/api/portraits/%s/%d.jpg', $gender, $index % self::PORTRAIT_POOL);
    }

    /** @return list<array<string, mixed>> */
    private function services(array $profile): array
    {
        $selected = $this->random->sample($profile['services'], $this->random->intBetween(2, count($profile['services'])));

        return array_map(
            fn (array $service): array => [
                'name' => $service[0],
                'unit' => $service[1],
                'price' => $service[2] === null ? null : $this->random->round($service[2] * $this->random->between(0.85, 1.2), 5),
            ],
            $selected,
        );
    }

    /** @return list<array<string, mixed>> */
    private function gallery(int $position, string $name, string $profession, string $city): array
    {
        $count = $this->random->intBetween(3, 6);

        return array_map(
            static fn (int $imageIndex): array => [
                'url' => sprintf('https://picsum.photos/seed/atlas-%d-%d/800/600', $position, $imageIndex),
                'alt' => sprintf('Trabalho de %s, %s em %s', $name, mb_strtolower($profession), $city),
                'width' => 800,
                'height' => 600,
            ],
            range(0, $count - 1),
        );
    }

    /** @return list<array<string, mixed>> */
    private function reviews(int $position, float $rating): array
    {
        $count = $this->random->intBetween(2, 6);

        return array_map(
            fn (int $reviewIndex): array => [
                'id' => sprintf('rev-%d-%d', $position, $reviewIndex + 1),
                'author' => $this->random->pick(SeedData::firstNames()) . ' ' . mb_substr($this->random->pick(SeedData::lastNames()), 0, 1) . '.',
                'rating' => max(3, min(5, (int) round($rating + $this->random->between(-0.6, 0.4)))),
                'comment' => $this->random->pick(SeedData::reviewComments()),
                'date' => $this->isoDate(2025),
            ],
            range(0, $count - 1),
        );
    }

    private function bio(array $profile, int $years, string $city, int $jobs, float $rating): string
    {
        $opener = str_replace(
            ['%Y', '%P', '%C'],
            [(string) $years, mb_strtolower($profile['title']), $city],
            $this->random->pick(SeedData::bioOpeners()),
        );

        $closer = str_replace(
            ['%J', '%R'],
            [(string) $jobs, str_replace('.', ',', number_format($rating, 1, '.', ''))],
            $this->random->pick(SeedData::bioClosers()),
        );

        $body = $this->random->sample(SeedData::bioBody(), 2);

        return implode(' ', [$opener . '.', ...$body, $closer]);
    }

    private function isoDate(int $year): string
    {
        $month = $this->random->intBetween(1, 12);
        $day = $this->random->intBetween(1, 28);

        return sprintf('%04d-%02d-%02dT00:00:00.000Z', $year, $month, $day);
    }
}

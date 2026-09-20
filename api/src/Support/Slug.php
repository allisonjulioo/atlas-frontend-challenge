<?php

declare(strict_types=1);

namespace Atlas\Api\Support;

use Atlas\Api\Catalog\Normalizer;

final class Slug
{
    public static function from(string $value): string
    {
        $normalized = Normalizer::text($value);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $normalized) ?? '';

        return trim($slug, '-');
    }
}

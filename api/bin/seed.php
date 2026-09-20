<?php

declare(strict_types=1);

use Atlas\Api\Seed\ProfessionalFactory;
use Atlas\Api\Seed\SeedData;
use Atlas\Api\Support\DeterministicRandom;

require __DIR__ . '/../vendor/autoload.php';

$factory = new ProfessionalFactory(new DeterministicRandom(SeedData::SEED));

$professionals = array_map(
    static fn (int $index): array => $factory->build($index),
    range(0, SeedData::TOTAL - 1),
);

$outputPath = __DIR__ . '/../data/professionals.json';

if (!is_dir(dirname($outputPath))) {
    mkdir(dirname($outputPath), 0o755, true);
}

file_put_contents(
    $outputPath,
    json_encode($professionals, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . PHP_EOL,
);

printf('[seed] %d profissionais -> %s%s', count($professionals), realpath($outputPath), PHP_EOL);

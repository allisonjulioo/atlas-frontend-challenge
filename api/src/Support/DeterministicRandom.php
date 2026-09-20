<?php

declare(strict_types=1);

namespace Atlas\Api\Support;

final class DeterministicRandom
{
    private const int MASK = 0xFFFFFFFF;
    private const int STEP = 0x6D2B79F5;
    private const float DIVISOR = 4294967296.0;

    private int $state;

    public function __construct(int $seed)
    {
        $this->state = $seed & self::MASK;
    }

    public function next(): float
    {
        $this->state = ($this->state + self::STEP) & self::MASK;

        $value = $this->imul($this->state ^ ($this->state >> 15), 1 | $this->state);
        $sum = ($value + $this->imul($value ^ ($value >> 7), 61 | $value)) & self::MASK;
        $value = ($sum ^ $value) & self::MASK;

        return (($value ^ ($value >> 14)) & self::MASK) / self::DIVISOR;
    }

    public function between(float $min, float $max): float
    {
        return $min + $this->next() * ($max - $min);
    }

    public function intBetween(int $min, int $max): int
    {
        return (int) floor($this->between($min, $max + 1));
    }

    public function chance(float $probability): bool
    {
        return $this->next() < $probability;
    }

    public function round(float $value, float $step): float
    {
        return round(round($value / $step) * $step, 2);
    }

    /** @template T @param list<T> $items @return T */
    public function pick(array $items): mixed
    {
        return $items[(int) floor($this->next() * count($items))];
    }

    /** @template T @param list<T> $items @return list<T> */
    public function sample(array $items, int $count): array
    {
        $pool = $items;
        $picked = [];

        while (count($picked) < $count && $pool !== []) {
            $index = (int) floor($this->next() * count($pool));
            $picked[] = $pool[$index];
            array_splice($pool, $index, 1);
        }

        return $picked;
    }

    private function imul(int $a, int $b): int
    {
        $a &= self::MASK;
        $b &= self::MASK;

        $aHigh = ($a >> 16) & 0xFFFF;
        $aLow = $a & 0xFFFF;
        $bHigh = ($b >> 16) & 0xFFFF;
        $bLow = $b & 0xFFFF;

        return (($aLow * $bLow) + (((($aHigh * $bLow) + ($aLow * $bHigh)) & 0xFFFF) << 16)) & self::MASK;
    }
}

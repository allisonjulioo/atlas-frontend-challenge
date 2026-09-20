<?php

declare(strict_types=1);

namespace Atlas\Api\Catalog;

final class Normalizer
{
    private const string ACCENTS = 'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÇçÑñ';
    private const string PLAIN = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn';

    public static function text(string $value): string
    {
        return mb_strtolower(strtr($value, self::map()));
    }

    /** @return array<string, string> */
    private static function map(): array
    {
        static $map = null;

        if ($map !== null) {
            return $map;
        }

        $accents = mb_str_split(self::ACCENTS);
        $plain = mb_str_split(self::PLAIN);

        $map = array_combine($accents, $plain);

        return $map;
    }
}

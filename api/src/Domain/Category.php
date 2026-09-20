<?php

declare(strict_types=1);

namespace Atlas\Api\Domain;

enum Category: string
{
    case Casa = 'casa';
    case Beleza = 'beleza';
    case BemEstar = 'bem-estar';
    case Tecnologia = 'tecnologia';
    case Educacao = 'educacao';
    case Eventos = 'eventos';

    public function label(): string
    {
        return match ($this) {
            self::Casa => 'Casa e reformas',
            self::Beleza => 'Beleza',
            self::BemEstar => 'Bem-estar',
            self::Tecnologia => 'Tecnologia',
            self::Educacao => 'Educação',
            self::Eventos => 'Eventos',
        };
    }
}

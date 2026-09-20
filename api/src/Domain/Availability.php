<?php

declare(strict_types=1);

namespace Atlas\Api\Domain;

enum Availability: string
{
    case Imediata = 'imediata';
    case EstaSemana = 'esta-semana';
    case Agendada = 'agendada';

    public function label(): string
    {
        return match ($this) {
            self::Imediata => 'Disponível agora',
            self::EstaSemana => 'Esta semana',
            self::Agendada => 'Sob agendamento',
        };
    }
}

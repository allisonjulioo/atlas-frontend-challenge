<?php

declare(strict_types=1);

namespace Atlas\Api\Domain;

enum SortKey: string
{
    case Relevancia = 'relevancia';
    case PrecoAsc = 'preco-asc';
    case PrecoDesc = 'preco-desc';
    case Avaliacao = 'avaliacao';
    case Distancia = 'distancia';
}

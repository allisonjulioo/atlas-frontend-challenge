<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Action;

use Atlas\Api\Catalog\CatalogRepository;
use Atlas\Api\Support\Json;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class HealthAction
{
    public function __construct(private CatalogRepository $repository)
    {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return Json::write($response, [
            'status' => 'ok',
            'professionals' => $this->repository->count(),
            'php' => PHP_VERSION,
        ]);
    }
}

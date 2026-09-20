<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Action;

use Atlas\Api\Catalog\CatalogRepository;
use Atlas\Api\Support\Json;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

final readonly class ShowProfessionalAction
{
    public function __construct(private CatalogRepository $repository)
    {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $professional = $this->repository->findBySlug((string) $args['slug']);

        if ($professional === null) {
            throw new HttpNotFoundException($request, sprintf('Profissional "%s" não encontrado', $args['slug']));
        }

        return Json::write($response, $professional);
    }
}

<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Action;

use Atlas\Api\Catalog\CatalogRepository;
use Atlas\Api\Catalog\CatalogSearch;
use Atlas\Api\Support\Json;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Exception\HttpNotFoundException;

final readonly class RelatedProfessionalsAction
{
    private const int LIMIT = 6;

    public function __construct(
        private CatalogRepository $repository,
        private CatalogSearch $search = new CatalogSearch(),
    ) {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        $reference = $this->repository->findBySlug((string) $args['slug']);

        if ($reference === null) {
            throw new HttpNotFoundException($request, sprintf('Profissional "%s" não encontrado', $args['slug']));
        }

        return Json::write($response, $this->search->related($this->repository, $reference, self::LIMIT));
    }
}

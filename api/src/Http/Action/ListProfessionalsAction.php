<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Action;

use Atlas\Api\Catalog\CatalogQuery;
use Atlas\Api\Catalog\CatalogRepository;
use Atlas\Api\Catalog\CatalogSearch;
use Atlas\Api\Support\Json;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class ListProfessionalsAction
{
    public function __construct(
        private CatalogRepository $repository,
        private CatalogSearch $search,
    ) {
    }

    public function __invoke(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $query = CatalogQuery::fromQueryParams($request->getQueryParams());

        return Json::write($response, $this->search->search($this->repository, $query));
    }
}

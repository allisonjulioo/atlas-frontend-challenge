<?php

declare(strict_types=1);

use Atlas\Api\Catalog\CatalogRepository;
use Atlas\Api\Catalog\CatalogSearch;
use Atlas\Api\Http\Action\HealthAction;
use Atlas\Api\Http\Action\ListProfessionalsAction;
use Atlas\Api\Http\Action\RelatedProfessionalsAction;
use Atlas\Api\Http\Action\ShowProfessionalAction;
use Atlas\Api\Http\Middleware\CacheControlMiddleware;
use Atlas\Api\Http\Middleware\CorsMiddleware;
use Atlas\Api\Http\Middleware\JsonErrorMiddleware;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';

$repository = new CatalogRepository(__DIR__ . '/../data/professionals.json');
$search = new CatalogSearch();

$app = AppFactory::create();

$app->add(new CacheControlMiddleware());
$app->add(new CorsMiddleware(explode(',', $_ENV['ATLAS_ALLOWED_ORIGINS'] ?? 'http://localhost:3000,http://localhost:3002,http://localhost:3003')));
$app->add(new JsonErrorMiddleware());

$app->get('/health', new HealthAction($repository));
$app->get('/professionals', new ListProfessionalsAction($repository, $search));
$app->get('/professionals/related/{slug}', new RelatedProfessionalsAction($repository));
$app->get('/professionals/{slug}', new ShowProfessionalAction($repository));

$app->options('/{routes:.*}', static fn ($request, $response) => $response);

$app->run();

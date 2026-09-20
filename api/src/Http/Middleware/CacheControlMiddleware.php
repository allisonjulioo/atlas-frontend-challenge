<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

final readonly class CacheControlMiddleware implements MiddlewareInterface
{
    private const string LIST_POLICY = 'public, max-age=30, stale-while-revalidate=300';
    private const string DETAIL_POLICY = 'public, max-age=300, stale-while-revalidate=3600';
    private const string NO_STORE = 'no-store';

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);
        $path = $request->getUri()->getPath();

        $policy = match (true) {
            $path === '/professionals' => self::LIST_POLICY,
            str_starts_with($path, '/professionals/') => self::DETAIL_POLICY,
            default => self::NO_STORE,
        };

        return $response->withHeader('Cache-Control', $policy);
    }
}

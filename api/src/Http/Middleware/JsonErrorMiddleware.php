<?php

declare(strict_types=1);

namespace Atlas\Api\Http\Middleware;

use Atlas\Api\Support\Json;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Exception\HttpException;
use Slim\Psr7\Response;
use Throwable;

final readonly class JsonErrorMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        try {
            return $handler->handle($request);
        } catch (HttpException $exception) {
            return Json::write(new Response(), [
                'error' => $exception->getTitle(),
                'message' => $exception->getMessage(),
            ], $exception->getCode());
        } catch (Throwable $exception) {
            return Json::write(new Response(), [
                'error' => 'Internal Server Error',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}

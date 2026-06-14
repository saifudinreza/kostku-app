<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Tidak pakai SPA cookie auth — frontend pakai Bearer token (disimpan di localStorage).
        // EnsureFrontendRequestsAreStateful dihapus agar tidak mewajibkan CSRF cookie.

        // HandleCors diprepend agar OPTIONS preflight (mis. multipart/form-data upload)
        // langsung dijawab dengan CORS headers sebelum menyentuh auth:sanctum.
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);

        $middleware->alias([
            'abilities'  => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability'    => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();

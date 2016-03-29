<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Routing\Middleware;
use Illuminate\Auth\Middleware\AuthenticateWithBasicAuth;

class ApiAuthOnce extends AuthenticateWithBasicAuth implements Middleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        return $this->auth->onceBasic('username') ?: $next($request);
    }
}

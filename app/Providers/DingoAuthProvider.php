<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class DingoAuthProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        app('Dingo\Api\Auth\Auth')->extend('basic', function ($app) {
		   return new Dingo\Api\Auth\Provider\Basic($app['auth'], 'username');
		});
    }
}

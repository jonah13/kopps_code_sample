<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Managers\UserManager;
use App\Managers\ProductManager;
use App\Managers\CategoryManager;
use App\Managers\LocationManager;
use App\Managers\ManufacturerManager;
use App\Managers\AccountManager;
use App\Managers\OrderManager;
use App\Managers\PricingTemplateManager;
use App\Managers\HelperManager;
use App\Managers\ProductOrderManager;

use App\Managers\CategoryAttrsManager;
use App\Managers\ProductAttrsManager;
use App\Managers\ExportManager;

class CustomProvider extends ServiceProvider {

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        /* App\Managers\UserManager */
        $this->app->bind('UserManager', function() {
            return new UserManager();
        });

        /* App\Managers\ProductManager */
        $this->app->bind('ProductManager', function() {
            return new ProductManager();
        });

        /* App\Managers\CategoryManager */
        $this->app->bind('CategoryManager', function() {
            return new CategoryManager();
        });

        /* App\Managers\LocationManager */
        $this->app->bind('LocationManager', function() {
            return new LocationManager();
        });

        /* App\Managers\ManufacturerManager */
        $this->app->bind('ManufacturerManager', function() {
            return new ManufacturerManager();
        });

        /* App\Managers\AccountManager */
        $this->app->bind('AccountManager', function() {
            return new AccountManager();
        });

        /* App\Managers\PricingTemplateManager */
        $this->app->bind('PricingTemplateManager', function() {
            return new PricingTemplateManager();
        });

        /* App\Managers\OrderManager */
        $this->app->bind('OrderManager', function() {
            return new OrderManager();
        });

        /* App\Managers\HelperManager */
        $this->app->bind('HelperManager', function() {
            return new HelperManager();
        });

        /* App\Managers\ProductOrderManager */
        $this->app->bind('ProductOrderManager', function() {
            return new ProductOrderManager();
        });

        /* App\Managers\ProductAttrsManager */
        $this->app->bind('ProductAttrsManager', function() {
            return new ProductAttrsManager();
        });

        /* App\Managers\CategoryAttrsManager */
        $this->app->bind('CategoryAttrsManager', function() {
            return new CategoryAttrsManager();
        });

        /* App\Managers\ExportManager */
        $this->app->bind('ExportManager', function() {
            return new ExportManager();
        });

    }
}

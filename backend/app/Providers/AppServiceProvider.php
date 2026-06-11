<?php

namespace App\Providers;

use App\Models\Invoice;
use App\Models\Message;
use App\Models\Property;
use App\Models\Room;
use App\Policies\InvoicePolicy;
use App\Policies\MessagePolicy;
use App\Policies\PropertyPolicy;
use App\Policies\RoomPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Property::class, PropertyPolicy::class);
        Gate::policy(Room::class, RoomPolicy::class);
        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
    }
}

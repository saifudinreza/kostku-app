<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('invoices:generate-monthly')->monthlyOn(1, '08:00');
Schedule::command('invoices:send-reminders')->dailyAt('09:00');
Schedule::command('invoices:mark-overdue')->dailyAt('00:00');

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\TenancyController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/owner', [DashboardController::class, 'ownerStats']);
    Route::get('/dashboard/tenant', [DashboardController::class, 'tenantStats']);
    Route::get('/dashboard/monthly-revenue', [DashboardController::class, 'monthlyRevenue']);

    // Properties (owner)
    Route::apiResource('properties', PropertyController::class);

    // Rooms
    Route::get('/properties/{property}/rooms', [RoomController::class, 'index']);
    Route::get('/rooms', [RoomController::class, 'allOwnerRooms']);
    Route::post('/rooms/generate-description', [RoomController::class, 'generateDescription']);
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::get('/rooms/{room}', [RoomController::class, 'show']);
    Route::put('/rooms/{room}', [RoomController::class, 'update']);
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy']);

    // Tenancies
    Route::get('/tenancies', [TenancyController::class, 'index']);
    Route::post('/tenancies', [TenancyController::class, 'store']);
    Route::put('/tenancies/{tenancy}', [TenancyController::class, 'update']);
    Route::post('/tenancies/{tenancy}/end', [TenancyController::class, 'end']);

    // Invoices
    Route::post('/invoices/generate-monthly', [InvoiceController::class, 'generateMonthly']);
    Route::get('/invoices', [InvoiceController::class, 'index']);
    Route::post('/invoices', [InvoiceController::class, 'store']);
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update']);

    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/invoices/{invoice}/pay', [PaymentController::class, 'createSnapToken']);

    // Messages / Chat
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/mark-read', [MessageController::class, 'markRead']);

    // AI
    Route::post('/ai/invoice-chat', [AiController::class, 'invoiceChat']);
    Route::post('/ai/financial-insight', [AiController::class, 'financialInsight']);
    Route::post('/ai/generate-room-description', [AiController::class, 'generateRoomDescription']);
});

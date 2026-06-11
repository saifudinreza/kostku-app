<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Room;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function ownerStats(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

        $totalRooms     = Room::whereIn('property_id', $propertyIds)->count();
        $occupiedRooms  = Room::whereIn('property_id', $propertyIds)->where('status', 'occupied')->count();
        $availableRooms = Room::whereIn('property_id', $propertyIds)->where('status', 'available')->count();
        $occupancyRate  = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

        $monthlyRevenue = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->where('status', 'paid')
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->sum('total_amount');

        $pendingInvoices = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->whereIn('status', ['unpaid', 'pending'])
            ->count();

        $overdueInvoices = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->where('status', 'overdue')
            ->count();

        $recentInvoices = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->with(['tenancy.tenant', 'tenancy.room'])
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($inv) => [
                'id'             => $inv->id,
                'invoice_number' => $inv->invoice_number,
                'status'         => $inv->status,
                'total_amount'   => $inv->total_amount,
                'due_date'       => $inv->due_date,
                'tenant_name'    => $inv->tenancy->tenant->name ?? '-',
                'room_number'    => $inv->tenancy->room->room_number ?? '-',
            ]);

        return response()->json([
            'total_properties'  => $propertyIds->count(),
            'total_rooms'       => $totalRooms,
            'occupied_rooms'    => $occupiedRooms,
            'available_rooms'   => $availableRooms,
            'monthly_revenue'   => $monthlyRevenue,
            'pending_invoices'  => $pendingInvoices,
            'overdue_invoices'  => $overdueInvoices,
            'recent_invoices'   => $recentInvoices,
            'occupancy_rate'    => $occupancyRate,
        ]);
    }

    public function tenantStats(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $activeTenancy = Tenancy::where('tenant_id', $user->id)
            ->where('status', 'active')
            ->with(['room.property', 'room.images'])
            ->latest()
            ->first();

        $currentRoom = null;
        if ($activeTenancy) {
            $currentRoom = [
                'room_number'      => $activeTenancy->room->room_number,
                'floor'            => $activeTenancy->room->floor,
                'price'            => $activeTenancy->room->price,
                'property_name'    => $activeTenancy->room->property->name,
                'property_address' => $activeTenancy->room->property->address,
                'property_city'    => $activeTenancy->room->property->city,
            ];
        }

        $tenancyIds = $user->tenancies()->pluck('id');

        $latestInvoice = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->with(['items', 'payment'])
            ->latest()
            ->first();

        $unpaidCount = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->whereIn('status', ['unpaid', 'overdue'])
            ->count();

        $paymentHistory = Payment::whereHas('invoice', fn($q) => $q->whereIn('tenancy_id', $tenancyIds))
            ->with('invoice')
            ->where('status', 'success')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($p) => [
                'id'             => $p->id,
                'amount'         => $p->amount,
                'payment_method' => $p->payment_method,
                'paid_at'        => $p->paid_at,
                'invoice_number' => $p->invoice->invoice_number ?? '-',
            ]);

        return response()->json([
            'current_room'    => $currentRoom,
            'active_tenancy'  => $activeTenancy,
            'latest_invoice'  => $latestInvoice,
            'unpaid_count'    => $unpaidCount,
            'payment_history' => $paymentHistory,
        ]);
    }

    public function monthlyRevenue(): JsonResponse
    {
        $user = Auth::user();

        if (!$user->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $propertyIds = $user->properties()->pluck('id');
        $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');

        $rows = Invoice::whereIn('tenancy_id', $tenancyIds)
            ->where('status', 'paid')
            ->where('updated_at', '>=', now()->subMonths(5)->startOfMonth())
            ->select(
                DB::raw('MONTH(updated_at) as month'),
                DB::raw('YEAR(updated_at) as year'),
                DB::raw('SUM(total_amount) as value')
            )
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

        $result = $rows->map(fn($r) => [
            'month' => $months[$r->month - 1],
            'value' => (int) $r->value,
        ]);

        return response()->json($result);
    }
}

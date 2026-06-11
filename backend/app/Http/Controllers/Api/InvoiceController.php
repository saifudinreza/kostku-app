<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Tenancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = Invoice::with(['tenancy.room.property', 'tenancy.tenant', 'payment']);

        if ($user->isOwner()) {
            $propertyIds = $user->properties()->pluck('id');
            $tenancyIds  = Tenancy::whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))->pluck('id');
            $query->whereIn('tenancy_id', $tenancyIds);

            if ($request->filled('property_id')) {
                $tenancyIds = Tenancy::whereHas('room', fn($q) => $q->where('property_id', $request->property_id))->pluck('id');
                $query->whereIn('tenancy_id', $tenancyIds);
            }
        } else {
            $tenancyIds = $user->tenancies()->pluck('id');
            $query->whereIn('tenancy_id', $tenancyIds);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->latest()->get();

        return response()->json($invoices);
    }

    public function store(Request $request): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $data = $request->validate([
            'tenancy_id'   => 'required|exists:tenancies,id',
            'period_month' => 'required|integer|between:1,12',
            'period_year'  => 'required|integer|min:2000',
            'due_date'     => 'required|date',
            'notes'        => 'nullable|string',
            'items'        => 'required|array|min:1',
            'items.*.name'   => 'required|string',
            'items.*.amount' => 'required|integer|min:0',
            'items.*.note'   => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $subtotal = collect($data['items'])->sum('amount');

            $invoice = Invoice::create([
                'tenancy_id'     => $data['tenancy_id'],
                'invoice_number' => Invoice::generateNumber(),
                'period_month'   => $data['period_month'],
                'period_year'    => $data['period_year'],
                'due_date'       => $data['due_date'],
                'subtotal'       => $subtotal,
                'total_amount'   => $subtotal,
                'status'         => 'unpaid',
                'notes'          => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $invoice->items()->create($item);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat invoice.', 'error' => $e->getMessage()], 500);
        }

        return response()->json($invoice->load('items', 'tenancy.tenant', 'tenancy.room.property'), 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $this->authorize('view', $invoice);

        $invoice->load(['items', 'payment', 'tenancy.tenant', 'tenancy.room.property']);

        return response()->json($invoice);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('update', $invoice);

        $data = $request->validate([
            'due_date'    => 'sometimes|date',
            'status'      => 'sometimes|in:unpaid,pending,paid,overdue',
            'notes'       => 'nullable|string',
        ]);

        $invoice->update($data);

        return response()->json($invoice->load('items', 'tenancy.tenant'));
    }

    public function generateMonthly(Request $request): JsonResponse
    {
        if (!Auth::user()->isOwner()) {
            return response()->json(['message' => 'Akses ditolak.'], 403);
        }

        $month = now()->month;
        $year  = now()->year;
        $count = 0;

        $propertyIds = Auth::user()->properties()->pluck('id');
        $tenancies   = Tenancy::where('status', 'active')
            ->whereHas('room', fn($q) => $q->whereIn('property_id', $propertyIds))
            ->with('room')
            ->get();

        DB::beginTransaction();
        try {
            foreach ($tenancies as $tenancy) {
                $exists = Invoice::where('tenancy_id', $tenancy->id)
                    ->where('period_month', $month)
                    ->where('period_year', $year)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $dueDate  = now()->setDay(10)->toDateString();
                $subtotal = $tenancy->room->price;

                $invoice = Invoice::create([
                    'tenancy_id'     => $tenancy->id,
                    'invoice_number' => Invoice::generateNumber(),
                    'period_month'   => $month,
                    'period_year'    => $year,
                    'due_date'       => $dueDate,
                    'subtotal'       => $subtotal,
                    'total_amount'   => $subtotal,
                    'status'         => 'unpaid',
                ]);

                $invoice->items()->create([
                    'name'   => "Sewa Kamar {$tenancy->room->room_number} — " . now()->locale('id')->monthName . " {$year}",
                    'amount' => $subtotal,
                ]);

                $count++;
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal generate invoice.', 'error' => $e->getMessage()], 500);
        }

        return response()->json(['message' => "{$count} invoice berhasil dibuat.", 'count' => $count]);
    }

    public function markOverdue(): JsonResponse
    {
        $updated = Invoice::where('status', 'unpaid')
            ->where('due_date', '<', now()->toDateString())
            ->update(['status' => 'overdue']);

        return response()->json(['message' => "{$updated} invoice diperbarui menjadi overdue."]);
    }
}

<?php

namespace App\Http\Controllers;

use DB;
use Exception;
use Illuminate\Http\Request;
use App\Models\Cashreceiptdetail;
use Illuminate\Support\Facades\Log;

class CashreceiptdetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $cashreceiptdetail = Cashreceiptdetail::create([
                'cashreceipts_id' => $request->cashreceipts_id,
                'services_id'     => $request->service_id,
                'name'            => $request->description,
                'price'           => $request->price
            ]);

            DB::commit();
            return response()->json(['message' => 'Cash receipt detail created successfully', 'data' => $cashreceiptdetail, 'success' => true], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('errores_personalizado')->error('Error creating cash receipt detail: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);
            return response()->json(['message' => 'Failed to create cash receipt detail', 'success' => false], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

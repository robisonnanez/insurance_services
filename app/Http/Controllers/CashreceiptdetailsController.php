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
                'cashreceipt_id' => $request->cashreceipt_id,
                'service_id'     => $request->service_id,
                'name'           => $request->description,
                'price'          => $request->price
            ]);

            DB::commit();
            return response()->json(['message' => 'Detalle del recibo de caja creado exitosamente.', 'data' => $cashreceiptdetail, 'success' => true], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('errores_personalizado')->error('Error al crear el detalle del recibo de efectivo: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);
            return response()->json(['message' => 'No se pudo crear el detalle del recibo de efectivo.', 'success' => false], 500);
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
        DB::beginTransaction();
        try {
            $cashreceiptdetail = Cashreceiptdetail::findOrFail($id);
            $cashreceiptdetail->update([
                'cashreceipt_id' => $request->cashreceipt_id,
                'service_id'     => $request->service_id,
                'name'           => $request->description,
                'price'          => $request->price
            ]);

            DB::commit();
            return response()->json(['message' => 'Detalle del recibo de efectivo actualizado exitosamente.', 'data' => $cashreceiptdetail, 'success' => true], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('errores_personalizado')->error('Error al actualizar el detalle del recibo de efectivo: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);
            return response()->json(['message' => 'No se pudo actualizar el detalle del recibo de efectivo.', 'success' => false], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $cashreceiptdetail = Cashreceiptdetail::findOrFail($id);
            $cashreceiptdetail->delete();

            DB::commit();
            return response()->json(['message' => 'Detalle del recibo de efectivo eliminado exitosamente.', 'success' => true], 200);
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('errores_personalizado')->error('Error al eliminar el detalle del recibo de efectivo: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);
            return response()->json(['message' => 'No se pudo eliminar el detalle del recibo de efectivo.', 'success' => false], 500);
        }
    }
}

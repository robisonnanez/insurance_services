<?php

namespace App\Http\Controllers;

use DB;
use Exception;
use Inertia\Inertia;
use App\Models\Cashreceipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CashreceiptdetailsController;

class CashreceiptsController extends Controller
{

    protected $cashreceiptdetails;

    public function __construct()
    {
        $this->cashreceiptdetails = new CashreceiptdetailsController();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userAuth = Auth::user();
        $user = [
            'id' => $userAuth->id,
            'name' => $userAuth->name,
            'email' => $userAuth->email,
            'companies_id' => $userAuth->companies_id,
            'companie' => $userAuth->companie
        ];

        $Cashreceipts = Cashreceipt::whereNull('deleted_at')->with('client', 'cashreceiptdetails')->get();

        $dataCashreceipts = [];
        foreach ($Cashreceipts as $key => $cashreceipt) {
            $dataCashreceipts[] = [
                'item'               => $key + 1,
                'id'                 => $cashreceipt->id,
                'clients_id'         => $cashreceipt->clients_id,
                'client_name'        => $cashreceipt->client ? $cashreceipt->client->fullname : null,
                'client_document'    => $cashreceipt->client ? $cashreceipt->client->document : null,
                'numberdocument'     => 'RC' . $cashreceipt->numberdocument,
                'date'               => $cashreceipt->date,
                'hour'               => $cashreceipt->hour,
                'datehour'           => $cashreceipt->date . ' ' . $cashreceipt->hour,
                'total'              => (int) $cashreceipt->total,
                'paying'             => $cashreceipt->paying,
                'cashreceiptdetails' => $cashreceipt->cashreceiptdetails,
            ];
        }

        $dataCashreceipts = collect($dataCashreceipts)->sortBy('client_name')->values()->all();

        return Inertia::render('insurance_services/cashreceipts/index',[
            'user' => $user,
            'cashreceipts' => $dataCashreceipts
        ]);
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
            // Generar número de documento
            $numberdocument = $this->generateNumberDocument();

            $cashreceipt = Cashreceipt::create([
                'clients_id'     => $request->client_id,
                'numberdocument' => $numberdocument,
                'date'           => $request->date,
                'hour'           => date("H:i:s"),
                'total'          => $request->total,
            ]);

            // Obtener id
            $id = $cashreceipt->id; // o $cashreceipt->getKey()

            // Crear detalles dentro de la misma transacción
            if (!is_array($request->details) || count($request->details) === 0) {
                throw new Exception('No se proporcionaron detalles válidos para el recibo', 422);
            }

            foreach ($request->details as $key => $value) {                
                $details = array(
                    "cashreceipts_id" => (int) $id,
                    "service_id" => $value['service_id'],
                    "description" => $value['description'],
                    "price" => $value['price'],
                );
                $cashreceiptdetails = $this->cashreceiptdetails->store(new Request((array)$details));
                
                if ($cashreceiptdetails->getStatusCode() !== 201) {
                    throw new Exception('Error al crear el detalle del recibo de caja en la posición ' . $key, 500);
                }
            }

            // Commit sólo si todos los detalles se crearon correctamente
            DB::commit();

            return redirect()->route('cashreceipts.index')
                ->with('message', 'Recibo de caja creado exitosamente')
                ->with('success', true);
        } catch (Exception $e) {
            DB::rollBack();
            Log::channel('errores_personalizado')->error('Error: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);


            if ($e->getCode() === 422) {
                return redirect()->back()
                    ->withErrors(['details' => $e->getMessage()])
                    ->with('message', $e->getMessage())
                    ->with('success', false);
            }

            return redirect()->back()
                ->with('message', 'Error al crear el recibo de caja: ' . $e->getMessage())
                ->with('success', false);
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

    /**
     * Genera el número de documento en formato AA######.
     * Debe ejecutarse dentro de una transacción para que lockForUpdate() funcione.
     */
    protected function generateNumberDocument(): string
    {
        $yearPrefix = date('y'); // e.g. '25'

        $maxRow = DB::table('cashreceipts')
            ->where('numberdocument', 'like', $yearPrefix . '%')
            ->select(DB::raw('MAX(numberdocument) as max'))
            ->lockForUpdate()
            ->first();

        if ($maxRow && $maxRow->max) {
            $lastSeq = (int) substr($maxRow->max, 2);
            $nextSeq = $lastSeq + 1;
        } else {
            $nextSeq = 1;
        }

        return $yearPrefix . str_pad($nextSeq, 6, '0', STR_PAD_LEFT);
    }

    public function markAsPaid(Request $request, string $id)
    {
        try {
            $cashreceipt = Cashreceipt::findOrFail($id);
            $cashreceipt->paying = true;
            $cashreceipt->save();

            return response()->json(['message' => 'Recibo de caja ' . $cashreceipt->numberdocument . ' marcado como pagado exitosamente.'], 200);
        } catch (Exception $e) {
            Log::channel('errores_personalizado')->error('Error al marcar como pagado el recibo de caja: ' . $e->getMessage(), [
                'exception' => $e,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'code' => $e->getCode(),
            ]);

            return response()->json(['message' => 'Error al marcar como pagado el recibo de caja: ' . $e->getMessage()], 500);
        }
    }
}

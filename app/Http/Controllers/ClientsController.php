<?php

namespace App\Http\Controllers;

use DB;
use Exception;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientsController extends Controller
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
        //
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

    public function getAllClients()
    {
        $clients = Client::all();
        return response()->json($clients);
    }

    public function storeClient(Request $request)
    {
        $response = [];
        try {
            $client = Client::create($request->all());
            $response = [
                'status' => 'success', 
                'message' => 'Cliente creado exitosamente.',
                'data' => $client
            ];
            // return inertia::render('insurance_services/cashreceipts', [
            //     'newClient' => $client,
            //     'activeModal' => true,
            // ]);
            return response()->json($response, 201);
        } catch (Exception $e) {
            $response = [
                'status' => 'error', 
                'message' => 'Failed to create client',
                'error' => $e->getMessage()
            ];
            // return inertia::render('insurance_services/cashreceipts', [
            //     'newClient' => null,
            //     'activeModal' => false,
            // ]);
            return response()->json($response, 500);
        }
        
    }
}

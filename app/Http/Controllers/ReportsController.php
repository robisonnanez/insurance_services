<?php

namespace App\Http\Controllers;

use App\Models\Companie;
use App\Models\Cashreceipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportsController extends Controller
{
    public function generateCashreceipts($id)
    {

        $company_id = Auth::user()->companies_id ?? 1;
        $company = Companie::where('id', $company_id)->first();
        $logo = $company->logo;

        $cashreceipt = Cashreceipt::where('id',$id)->with(['client', 'cashreceiptdetails'])->first();
        
        $pdf = \PDF::loadView('pdf.cashreceipt.index', compact('cashreceipt', 'logo'))
            ->setOption('page-width', '215.9mm')
            ->setOption('page-height', '139.7mm')
            ->setOption('margin-top', '25mm')
            ->setOption('margin-bottom', '15mm')
            ->setOption('header-html', view('pdf.partials.header', ['numberdocument' => $cashreceipt->numberdocument, 'company' => $company]))
            ->setOption('footer-html', view('pdf.partials.footer'));

        return $pdf->stream('Recibo_RC'.$cashreceipt->numberdocument.'.pdf');
    }
}

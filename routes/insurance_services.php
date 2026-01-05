<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientsController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\CashreceiptsController;

Route::middleware('auth')->group(function () {
  Route::prefix('insurance-services')->group(function () {
    Route::prefix('cashreceipts')->group(function () {
      Route::get('/', [CashreceiptsController::class, 'index'])->name('cashreceipts.index');
      Route::post('/store', [CashreceiptsController::class, 'store'])->name('cashreceipts.store');
      Route::post('/update/{id}', [CashreceiptsController::class, 'update'])->name('cashreceipts.update');
      Route::get('/show/{id}', [CashreceiptsController::class, 'show'])->name('cashreceipts.show');
      Route::delete('/destroy/{id}', [CashreceiptsController::class, 'destroy'])->name('cashreceipts.destroy');
      Route::post('/markAsPaid/{id}', [CashreceiptsController::class, 'markAsPaid'])->name('cashreceipts.markAsPaid');
    });
    Route::prefix('companies')->group(function () {
      Route::get('/all', [CompaniesController::class, 'getAllCompanies'])->name('companies.all');
    });
    Route::prefix('clients')->group(function () {
      Route::get('/all', [ClientsController::class, 'getAllClients'])->name('clients.all');
      Route::post('/storeClient', [ClientsController::class, 'storeClient'])->name('clients.storeClient');
    });
    Route::prefix('services')->group(function () {
      Route::get('/all', [ServicesController::class, 'getAllServices'])->name('services.all');
    });
  });
});

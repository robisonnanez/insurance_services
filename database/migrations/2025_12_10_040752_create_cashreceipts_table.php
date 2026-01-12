<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cashreceipts', function (Blueprint $table) {
            $table->integer('id')->autoIncrement()->comment('Llave primaria');
            $table->integer('client_id')->comment('Llave foranea de la tabla clients');
            $table->string('numberdocument', 8)->comment('Número de recibo de caja');
            $table->date('date')->nullable()->comment('Fecha de creación del recibo de caja');
            $table->time('hour')->nullable()->comment('Hora de creación del recibo de caja');
            $table->decimal('total', 16, 2)->nullable()->comment('Valor total del recibo de caja');
            $table->boolean('paying')->nullable()->default(false)->comment('Indica si el recibo de caja ha sido pagado');
            $table->timestamps();
            $table->softDeletes();
            $table->index(['date', 'numberdocument'], 'receipt_date_index');
            $table->index(['date', 'hour', 'numberdocument'], 'receipt_date_hour_index');
            $table->index(['client_id', 'numberdocument'], 'receipt_index');
            $table->index(['client_id', 'numberdocument', 'total'], 'receipt_total_index');
            $table->index('created_at', 'created_at_index');
            $table->index('updated_at', 'updated_at_index');
            $table->index('deleted_at', 'deleted_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cashreceipts');
    }
};

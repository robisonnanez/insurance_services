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
        Schema::create('cashreceiptdetails', function (Blueprint $table) {
            $table->integer('id')->autoIncrement()->comment('Llave principal');
            $table->integer('cashreceipts_id')->comment('Llave foranea de la tabla cashreceipts');
            $table->foreign('cashreceipts_id')->references('id')->on('cashreceipts');
            $table->integer('services_id')->comment('Llave foreanea de la tabla services');
            $table->foreign('services_id')->references('id')->on('services');
            $table->string('name', 100)->comment('Nombre del servicio');
            $table->decimal('price', 16, 2)->comment('Precio del servicio');
            $table->timestamps();
            $table->softDeletes();
            $table->index('name', 'name_index');
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
        Schema::dropIfExists('cashreceiptdetails');
    }
};

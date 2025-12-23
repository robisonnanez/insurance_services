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
        Schema::create('services', function (Blueprint $table) {
            $table->integer('id')->autoIncrement()->comment('Llave principal');
            $table->string('name', 100)->comment('Nombre del servicio');
            $table->text('description')->nullable()->comment('Descripcion completa del servicio');
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
        Schema::dropIfExists('services');
    }
};

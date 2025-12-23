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
        Schema::create('companies', function (Blueprint $table) {
            $table->engine('InnoDB');
            $table->charset('utf8mb4');
            $table->collation('utf8mb4_general_ci');
            $table->integer('id')->autoIncrement()->comment('Llave primaria');
            $table->string('name', 100)->comment('Nombre de la empresa');
            $table->string('document', 50)->comment('Nit de la empresa');
            $table->smallInteger('dv')->comment('Digito de verificacion de la empresa');
            $table->string('address', 100)->nullable()->comment('Direccion de la empresa');
            $table->string('phone', 15)->nullable()->comment('Número de la empresa');
            $table->string('cellphone', 15)->nullable()->comment('Número de celular de la empresa');
            $table->text('logo')->nullable()->comment('Logo de la empresa');
            $table->timestamps();
            $table->softDeletes();
            $table->index(['document', 'dv'], 'companie_index');
            $table->index(['document', 'name'], 'name_document_index');
            $table->index(['name', 'address'], 'name_address_index');
            $table->index(['document', 'name', 'address'], 'document_name_address_index');
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
        Schema::dropIfExists('companies');
    }
};

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
        Schema::create('clients', function (Blueprint $table) {
            $table->integer('id')->autoIncrement()->comment('Llave primaria');
            $table->string('names', 50)->comment('Nombres del cliente');
            $table->string('surnames', 50)->comment('Apellidos del cliente');
            $table->string('fullname', 100)->nullable()->comment('Nombre completo del cliente');
            $table->string('document', 50)->comment('Número de documento del cliente');
            $table->smallInteger('dv')->comment('Digito de verificacion');
            $table->string('address', 100)->nullable()->comment('Direccion del cliente');
            $table->string('phone', 15)->nullable()->comment('Número de telefono del cliente');
            $table->string('cellphone', 15)->nullable()->comment('Número de celular del cliente');
            $table->string('email', 100)->nullable()->comment('Correo electronico del cliente');
            $table->timestamps();
            $table->softDeletes();
            $table->index(['names', 'surnames'], 'name_surname_index');
            $table->index(['id', 'names', 'surnames'], 'clients_index');
            $table->index('document', 'document_index');
            $table->index('email', 'email_index');
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
        Schema::dropIfExists('clients');
    }
};

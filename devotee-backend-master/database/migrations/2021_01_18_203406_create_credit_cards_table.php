<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditCardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_cards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->string('card_id');
                $table->string('brand');
                $table->string('holder_name');
                $table->string('first_digits');
                $table->string('last_digits');
                $table->string('country')->nullable();
                $table->string('fingerprint');
                $table->boolean('valid');
                $table->string('expiration_date');
                $table->boolean('main')->default(true);
    
                $table->string('street')->nullable();
                $table->string('street_number')->nullable();
                $table->string('state')->nullable();
                $table->string('city')->nullable();
                $table->string('neighborhood')->nullable();
                $table->string('zip_code')->nullable();
    
    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('credit_cards');
    }
}

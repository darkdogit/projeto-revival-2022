<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFiltersTable extends Migration
{

    public function up()
    {
        Schema::create('filters', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->enum('type',['cid','medical_procedures', 'hospitals','drugs', 'things_i_use'])->nullable();
            $table->integer('filter_id');

            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('filters');
    }
}

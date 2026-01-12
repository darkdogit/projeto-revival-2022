<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDisabilityDescriptionToUsersTable extends Migration
{
   
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('disability_description')->nullable();
            $table->string('occupation')->nullable();
            $table->text('about')->nullable();
            $table->string('address_description')->nullable();
        });
    }

    
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['disability_description','occupation','about','address_description']);
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTiicToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('tiic')->default(0);
            $table->boolean('show_me')->default(1);
            $table->boolean('prejudice')->default(0);
            $table->boolean('show_age')->default(1);
            $table->boolean('show_distance')->default(1);

            $table->string('things_i_use')->nullable();
            $table->string('illicit_drugs')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tiic', 'show_me', 'prejudice', 'things_i_use', 'illicit_drugs','show_age', 'show_distance']);
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();

            $table->boolean('active')->default(true);
            $table->string('email')->unique();

            $table->date('birthdate')->nullable();


            $table->enum('account_type',['curious','special', 'devotee'])->nullable();
            $table->string('gender')->nullable();
            $table->enum('show_as_gender',['male','female'])->nullable();

            $table->string('sexual_orientation')->nullable();

            $table->enum('target_gender',['male','female','all'])->default('all')->nullable();

            $table->enum('type',['admin','user'])->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();

            $table->string('notification_token')->nullable();


            $table->double('lat')->nullable();
            $table->double('lng')->nullable();

            $table->integer('age_min')->default(18);
            $table->integer('age_max')->default(120);
            $table->integer('max_distance')->default(150);





            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}

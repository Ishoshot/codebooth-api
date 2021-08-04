<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class EditUsersAddNotifyHelpers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notify_follow')->default(true);
            $table->boolean('show_teams')->default(true);
            $table->boolean('show_projects')->default(true);
            $table->boolean('show_codes')->default(true);
            $table->boolean('notify_teams')->default(true);
            $table->boolean('notify_projects')->default(true);
            $table->boolean('notify_codes')->default(true);
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
            //
        });
    }
}

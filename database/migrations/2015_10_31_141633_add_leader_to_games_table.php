<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLeaderToGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('games', function(Blueprint $table) {
            $table->smallInteger('lead_seat')->unsigned()->default(0)->after('play_area');
            $table->smallInteger('dealer_seat')->unsigned()->default(0)->after('lead_seat');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('games', function(Blueprint $table) {
            $table->dropColumn('lead_seat');
            $table->dropColumn('dealer_seat');
        });
    }
}

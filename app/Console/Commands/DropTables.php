<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class DropTables extends Command  {

    protected $name = 'migrate:clear';

    protected $description = 'Clears all the tables.';

    public function __construct() {
        parent::__construct();
    }

    public function fire() {
        $tables = [];

        DB::statement( 'SET FOREIGN_KEY_CHECKS=0' );

        foreach (DB::select('SHOW TABLES') as $k => $v) {
            $tables[] = array_values((array)$v)[0];
        }

        foreach($tables as $table) {
            Schema::drop($table); echo "Table ".$table." has been dropped.".PHP_EOL;
        }
    }
}

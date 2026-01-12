<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\SubscriptionInfoController;
use Illuminate\Support\Facades\Storage;



class verifySubsGoogle extends Command
{

    protected $signature = 'subscription:google';
    protected $description = 'Command description';


    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        SubscriptionInfoController::cronSubsUpdateGoogle();
    }

}
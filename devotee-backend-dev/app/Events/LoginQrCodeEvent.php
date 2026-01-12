<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; 
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; 

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\QrCode;


class LoginQrCodeEvent implements ShouldBroadcast

{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

   
    public function __construct($data)
    {
        $this->payload = $data;
    }

    public function broadcastOn()
    {
        return [
            new Channel('login.' . $this->payload['hash']),
        ];

    }

    public function broadcastAs()
    {
        return 'login-qrcode';
    }

}

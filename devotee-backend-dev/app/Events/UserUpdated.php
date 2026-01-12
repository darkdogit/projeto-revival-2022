<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // with queue
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // no queue

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// class NewMessage implements ShouldBroadcastNow
class UserUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    public function __construct($p)
    {
        $this->payload = (object)$p;
    }

    public function broadcastOn()
    {
        // return new Channel('chat');
        return [
            new Channel('user.' . $this->payload->id),
        ];

    }

    public function broadcastAs() //change name of the message
    {
        return 'update';
    }

    // public function broadcastWith() //change the payload of the messag
    // {
    //     return [
    //         'lalala' => $this->message->sender_id
    //     ];
    // }
}

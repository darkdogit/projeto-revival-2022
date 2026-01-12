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
class RequestChangedEvent implements ShouldBroadcast

{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($p)
    {
        $this->payload = $p;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // return new Channel('chat');
        return [
            new Channel('request_changes.' . $this->payload->request_id),
            new Channel('request_changes')
        ];

    }

    public function broadcastAs() //change name of the message
    {
        return 'updated-request';
    }

    // public function broadcastWith() //change the payload of the messag
    // {
    //     return [
    //         'lalala' => $this->message->sender_id
    //     ];
    // }
}

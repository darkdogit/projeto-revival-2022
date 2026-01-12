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

use App\Models\MatchMessage;


// class NewMessage implements ShouldBroadcastNow
class NewMessageEvent implements ShouldBroadcast

{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $payload;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(MatchMessage $p)
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
        //dd($this->payload->recipient_id);die();
        return [
            new Channel('match.' . $this->payload->match_id),
            new Channel('user_messages.' . $this->payload->user_id),
            new Channel('user_messages.' . $this->payload->recipient_id),
            // new Channel('match_messages'),
        ];

    }

    public function broadcastAs() //change name of the message
    {
        return 'new-message';
    }

    // public function broadcastWith() //change the payload of the messag
    // {
    //     return [
    //         'lalala' => $this->message->sender_id
    //     ];
    // }
}

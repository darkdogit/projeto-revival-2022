<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StripeService;
use App\Models\User;
use App\Events\UserUpdated;



class StripeController extends Controller
{

    public function __construct(StripeService $s )
    {
        $this->stripe = $s;
    }
    public function webhook(Request $request){

        $payload = @file_get_contents('php://input');
        $event = $this->stripe->treatWebhookEvent(json_decode($payload, true));
        // $object = $event->data->object;

        $type = $event->type;


        // $this->telegram(json_encode($event));

        //customer.subscription.created
        //customer.subscription.deleted
        
        //customer.subscription.updated

        switch ($type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':

                $subscription = $event->data->object;

                if(!isset($subscription->id)) return ['status'=>false,'message'=>'couldnt find subscription'];

                $user = User::where('subscriptions_id',$subscription->id)->first();

                if(!$user) return ['status'=>false,'message'=>'user not found'];

                $invoice = $this->stripe->getInvoice($subscription->latest_invoice);

                $intent = $this->stripe->PaymentIntent($invoice->payment_intent);
                $method_id = $intent->payment_method;

                $this->updateUserPaymentMethod($user,$method_id);

                if ($subscription->status == 'active') {
                    $user->plan_type = 'premium';
                    $user->save();
                } else {
                    $user->plan_type = 'free' ;
                    $user->save();
                }

                    // $event = event(new UserUpdated($user));

                # code...
                break;
            
            default:
                # code...
                break;
        }


    }


        private function updateUserPaymentMethod(User $user,$method_id){

        // $costumer = $this->stripeServiceModel->updateCostumer(
        //     $user->stripe_id, $method_id
        // );


        $subscription = $this->stripe->updatedSubscriptions(
            $user->subscriptions_id, $method_id
        );

        return $subscription;


    }






    private function telegram($msg){

        $curl = curl_init();

        curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.telegram.org/bot1707014858:AAFcfdi3qFRBf8nhrIZysvVmIIHNcX5j6ME/sendMessage",

        // 1707014858:AAFcfdi3qFRBf8nhrIZysvVmIIHNcX5j6ME

        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "chat_id=164700499&text=".$msg."&parse_mode=HTML",
        CURLOPT_HTTPHEADER => [
            "content-type: application/x-www-form-urlencoded"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        // if ($err) {
        // echo "cURL Error #:" . $err;
        // } else {
        // echo $response;
        // }
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\ProjectPayment;
use App\User;


use App\Services\PagarMeService;


class PaymentController extends Controller
{
    //
    public function __construct(User $user, PagarMeService $pms)
    {
 

        $this->pagarme = $pms;

    }
    private function queryToObj($qry)
        {
                $result = array();
                //string must contain at least one = and cannot be in first position
                if(strpos($qry,'=')) {

                 if(strpos($qry,'?')!==false) {
                   $q = parse_url($qry);

                   $qry = $q['path'];
                  }
                }else {
                        return false;
                }

                foreach (explode('&', $qry) as $couple) {
                        list ($key, $val) = explode('=', $couple);
                        $result[$key] = $val;
                }

                return empty($result) ? false : (object)$result;
        }


        public function postback(Request $request){


            // PAGARME TRANSACTION STATUS - processing, authorized, paid, refunded, waiting_payment, pending_refund, refused
    
            // PAGARME SUBSCRIPTION STATUS - trialing, paid, pending_payment, unpaid, canceled, ended
    
            $postbackPayload = file_get_contents('php://input');
            $signature = $_SERVER['HTTP_X_HUB_SIGNATURE'];
    
            $postbackIsValid = $this->pagarme->postbacksValidate($postbackPayload, $signature);
            if (!$postbackIsValid) {
                $response = ['status' => true];
                return $response;
            }
    
            if($request->object == 'transaction'){ //pagamentos de projeto
            //    $find = ProjectPayment::where('transaction_id',$request->id)->first();
            //    $find->status = $request->current_status;
            //    $find->save();
            }
    
            else if($request->object == 'subscription'){ //plan subscription
                $find = User::where('subscription_id',$request->id)->first();
                $find->status = $request->current_status;
    
                $find->save();
            } 
    
    
    
      }
   
}

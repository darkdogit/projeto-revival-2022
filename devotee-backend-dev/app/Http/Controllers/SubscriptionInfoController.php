<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionInfo;
use App\Models\User;

use App\Services\InAppPurchaseService;
use Illuminate\Http\Request;

class SubscriptionInfoController extends Controller
{
    
    public function __construct(SubscriptionInfo $subscriptionInfo, InAppPurchaseService $InAppPurchaseService, User $user)
    {
        $this->InAppPurchaseService = $InAppPurchaseService;
        $this->subscriptionInfoModel = $subscriptionInfo;
        $this->userModel = $user;
        $this->user_id = @auth()->guard('api')->user()->id;
    }

    public function store(Request $request)
    {

        $user = $this->userModel->find($this->user_id);

        $request->merge(['user_id' => $this->user_id]);
        $subs_info = $this->subscriptionInfoModel->updateOrCreate(
            ['user_id' =>  $this->user_id],
            $request->all()
        );

        if ($request->type === 'google') {
            $data = $this->subsUpdateGoogle($subs_info);


            if (@$data->paymentState == 1) {
                $user->plan_type = 'premium';
            }
            $user->save();


        }elseif($request->type === 'apple'){
            $this->subsUpdateApple($subs_info);

            if (@$data->status == 0) {
                $user->plan_type = 'premium';
            }
            $user->save();
        }


        $response = ['status' => true, 'data' => $subs_info];
        return $response;
    }

   
    public function show($user_id)
    {
        $subs_info = $this->subscriptionInfoModel->where('user_id', $user_id)->first();
        return ['status' => true, 'data' => $subs_info];
    }


    public function subsUpdateGoogle($subs_info)
    {
        $assertion = $this->InAppPurchaseService->getAssertion();
        $bearer = $this->InAppPurchaseService->generateBearer($assertion);

        //$productId, $purchaseToken, $bearer
        $googleVerify = $this->InAppPurchaseService->googleVerify($subs_info->productId,$subs_info->purchaseToken, $bearer->access_token);


        return $googleVerify;
    }

    public function subsUpdateApple($subs_info)
    {
        $appleVerify = $this->InAppPurchaseService->appleVerifyDev($subs_info->transactionReceipt);

        return $appleVerify;
    }

    public function cronSubsUpdateGoogle()
    {
        $subs = $this->subscriptionInfoModel->with('user')->where('type', 'google')->get();

        $assertion = $this->InAppPurchaseService->getAssertion();
        $bearer = $this->InAppPurchaseService->generateBearer($assertion);

        for ($i=0; $i < count($subs); $i++) {

            $googleVerify = $this->InAppPurchaseService->googleVerify($subs[$i]->productId,$subs[$i]->purchaseToken, $bearer->access_token);

            if (@$googleVerify->paymentState != 1 AND $subs[$i]->user->plan_type === 'premium') {

                $this->userModel::where('id', $subs[$i]->user->id)
                  ->update(['plan_type' => 'free']);
            }elseif(@$googleVerify->paymentState == 1 AND $subs[$i]->user->plan_type === 'free'){
                $this->userModel::where('id', $subs[$i]->user->id)
                  ->update(['plan_type' => 'premium']);
            }

        }
        
    }

    public function cronSubsUpdateApple()
    {
        $subs = $this->subscriptionInfoModel->with('user')->where('type', 'apple')->get();

        for ($i=0; $i < count($subs); $i++) { 

            $appleVerify = $this->InAppPurchaseService->appleVerifyDev($subs[$i]->transactionReceipt);

            if (@$appleVerify->status != 0 AND $subs[$i]->user->plan_type === 'premium') {

                $this->userModel::where('id', $subs[$i]->user->id)
                  ->update(['plan_type' => 'free']);
            }elseif(@$appleVerify->status == 0 AND $subs[$i]->user->plan_type === 'free'){

                $this->userModel::where('id', $subs[$i]->user->id)
                  ->update(['plan_type' => 'premium']);
            }
            
        }
        
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use App\Models\User;
use App\Models\Address;


use Illuminate\Http\Request;
use Validator;

use App\Services\PagarMeService;

class CreditCardController extends Controller
{
    private $creditCardModel;
    private $pagarmeService;

    public function __construct(CreditCard $creditCardModel, PagarMeService $pagarmeService)
    {
        $this->creditCardModel = $creditCardModel;
        $this->pagarmeService = $pagarmeService;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index()
    {
       
        $cards = $this->creditCardModel
        ->where('user_id', $this->user_id)
        ->orderBy('main', 'desc')
        ->get();

        $response = ['status' => true, 'data' => $cards];
        return $response;
        
    }

    
    public function create()
    {
        
    }

    
    public function store(Request $request)
    {
        if (!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário inválido'];
            return $response;
        }

        request()->validate([
                // 'holder_name'      =>  'required',
                // 'number'      =>  'required',
                // 'expiration_date'      =>  'required',
                // 'cvv'  =>  'required',
                'card_hash'  =>  'required',

                'street'     =>  'nullable',
                'street_number'       => 'nullable',
                'state'       => 'nullable',
                'city'       => 'nullable',
                'neighborhood' => 'nullable',
                'zip_code' => 'nullable',
            ]
        );



        // $cardInfo = (object)[];//$this->pagarmeService->createCardByHash($request->card_hash);
        $cardInfo = $this->pagarmeService->createCardByHash($request->card_hash);
        // $cardInfo->card_id = 1;//$cardInfo->id;
        $cardInfo->card_id = $cardInfo->id;
        // $cardInfo->brand = 'test';
        // $cardInfo->holder_name = 'test';
        // $cardInfo->first_digits = 'test';
        // $cardInfo->last_digits = 'test';
        // $cardInfo->fingerprint = 'test';
        // $cardInfo->valid = false;
        // $cardInfo->expiration_date = '2020-01-20';

        $cardInfo->user_id = $this->user_id;

        if($request->street){
            $cardInfo->street = $request->street;
            $cardInfo->street_number = $request->street_number;
            $cardInfo->state = $request->state;
            $cardInfo->city = $request->city;
            $cardInfo->neighborhood = $request->neighborhood;
            $cardInfo->zip_code = $request->zip_code;
        } else {
            $addr = Address::where('user_id',$this->user_id)->latest()->first();

            if(!$addr) return ['status' => false, 'message' => 'usuário não possui endereço cadastrado'];

            $cardInfo->street = $addr->street;
            $cardInfo->street_number = $addr->street_number;
            $cardInfo->state = $addr->state;
            $cardInfo->city = $addr->city;
            $cardInfo->neighborhood = $addr->neighborhood;
            $cardInfo->zip_code = $addr->zip_code;

        }

        
        $cardInfo->main = true;

        $this->creditCardModel->where('user_id',$this->user_id)->update(['main'=>false]);

        $card = $this->creditCardModel->create((array)$cardInfo);
        unset($card['id']);

        $response = ['status' => true, 'data' => $card];
        return $response;
    }

    
    public function show(CreditCard $creditCard)
    {
        
    }

    
    public function edit(CreditCard $creditCard)
    {
        
    }

    
    public function update(Request $request, CreditCard $creditCard)
    {
        
    }

    
    public function destroy(CreditCard $creditCard)
    {
        
    }
}

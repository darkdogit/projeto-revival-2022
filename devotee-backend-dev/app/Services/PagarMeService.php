<?php
namespace App\Services;

use Illuminate\Http\Request;
use PagarMe\Client;
use PagarMe\PagarMeException;
use Exception;

use App\Models\Plan;
use App\Models\CreditCard;

use App\Models\User;



class PagarMeService{

    private $api_key;
    private $PagarMe;

    public function __construct()
    {
        $this->api_key 	= env('PAGARME_KEY');
        $this->PagarMe 	= $this->initPagarme();
    }

    private function initPagarme()
    {
        return new Client($this->api_key);
    }

    public function createBankAccount($data,$bank_code)
    {
		return $this->PagarMe->bankAccounts()->create([
			'bank_code' 		=> 	$bank_code,
			'agencia' 			=> 	$data['agency'],
			'agencia_dv' 		=> 	$data['agency_verifier'] || '',
			'conta' 			=> 	$data['account'],
			'conta_dv' 			=> 	$data['account_verifier'] || '',
			'document_type' 	=> 	'cpf',
			'document_number' 	=> 	$data['document'],
			'legal_name' 		=> 	$data['holder']
		]);
    }

     public function createReceiver($bank)
    {
		return $this->PagarMe->recipients()->create([
			'transfer_interval' => 'daily',
			'transfer_enabled' => 'true', 
			'bank_account'=>$bank
		  	// 'automatic_anticipation_enabled' => 'true', 
			// 'bank_account_id' => $bank_account, 
		]);
	}

    public function createCard($cardInfo)
    {
        return $this->PagarMe->cards()->create([
	          'holder_name' => $cardInfo['holder_name'],
	          'number' => $cardInfo['number'],
	          'expiration_date' => $cardInfo['expiration_date'],
	          'cvv' => $cardInfo['cvv']
		]);
    }
	public function createCardByHash($hash)
    {
        return $this->PagarMe->cards()->create([
	          'card_hash' => $hash,
		]);
    }
    public function transactionPaymentNotify($transaction_id, $email)
    {
  		return $this->PagarMe->transactions()->collectPayment([
		    'id' => $transaction_id,
		    'email' => $email
		]);
    }

    public function createTransaction($user, $adress, $total, $method,$card_hash)
    {	
    	//var_dump($user);die();
    	$total = (int) ( $total * 100 );

    	$str = ['(', ')', '.', '-'];
		$rplc =['','','',''];

		//env('PAGARME_DEFAULT_RECIPIENT')

        return $this->PagarMe->transactions()->create([
		  'amount' => $total,
		  'payment_method' => $method,
		  'async' => true,
		//   'card_id' => $method == 'credit_card' ? $card_id : null,
		  'card_hash' => $method == 'credit_card' ? $card_hash : null,

			'postback_url' => 'https://api.chefedeplantao.com.br/api/payment-postback',

		  'customer' => [
		    'external_id' => (string)$user->id,
		    'name' => (string)$user->name,
		    'email' => (string)$user->email,
		    'type' => 'individual',
		      'country' => 'br',
		      'documents' => [
		        [
		          'type' => strlen($user->document) > 14 ? 'cnpj': 'cpf',
		          'number' => str_replace($str,$rplc, $user->document)
		        ]
		      ],
		      'phone_numbers' => [ '+55'.str_replace($str,$rplc, $user->phone) ]
		  ],
		  'billing' => [
		      'name' => (string)$user->name,
		      'address' => [
		        'country' => 'br',
		        'street' => (string)$adress->street,
		        'street_number' => (string)$adress->number,
		        'state' => (string)$adress->state,
		        'city' => (string)$adress->city,
		        'neighborhood' => (string)$adress->neighborhood,
		        'zipcode' => str_replace($str,$rplc, $adress->zip_code),
		      ]
		  ],
		  'items' => [
		  	   	[
				'id' => '1',
	           		'title' => 'Projeto de Desenvolvimento Phurshell',
	          		'unit_price' => $total,
	          		'quantity' => 1,
	          		'tangible' => false
	          	]
					 ],

		
		]);

    }

    public function createCustomer($user,$tel,$cpf)
    {
   
        $documents = [
            [
              'type' => 'cpf',
              'number' => str_replace(['-','.'],'',$cpf)
            ],
        ];
		return  $this->PagarMe->customers()->create([
			'external_id' 	=> 'CUSTOMER_ID'.$user->id,
			'name' 			=> $user->nome.' '.$user->sobrenome,
			'type' 			=> 'individual',
			'country' 		=> 'br',
			'email' 		=> $user->email,
			'documents' 	=> $documents,
			'phone_numbers' => [
				'+55'.trim(str_replace(['-','(',')',' '],'',$tel)),
			]
		]);
	}

	public function createAcountBank($params,$pg_bank_account_id)
	{
		return $this->PagarMe->recipients()->create([
			  'anticipatable_volume_percentage' 	=> '85', 
			  'automatic_anticipation_enabled' 		=> 'true', 
			  'bank_account_id' 					=> $pg_bank_account_id, 
			  'transfer_day' 						=> '5', 
			  'transfer_enabled' 					=> 'true', 
			  'transfer_interval' 					=> 'weekly'
		]);
	}

	public function refund($transaction_id)
	{
		return $this->PagarMe->transactions()->refund([
		    'id' => $transaction_id
		]);
	}

	public function updatePlan(User $user){

		$newPlan = Plan::find($user->plan_id);
		  return $this->PagarMe->subscriptions()->update([
			'id' => $user->subscription_id,
			'plan_id' => $newPlan->pm_plan_id,
		]);
	}

	public function changePlanPaymentMethod(User $user,$method = null, $card_id = null){

		$data = [
			'id' => $user->subscription_id
		];

		if($method) $data['payment_method'] = $method;
		if($method) $data['card_id'] = $card_id;


		return $this->PagarMe->subscriptions()->update($data);
  }

	public function refundPartial($transaction_id,$amount)
	{
		return $this->PagarMe->transactions()->refund([
		  'id'	 	=> $transaction_id,
		  'amount' 	=> $amount,
		]);
	}

	public function createTransfers($amount,$recipient_id)
	{
		return $this->PagarMe->transfers()->create([
			'amount' => $amount,
			'recipient_id' => $recipient_id
		]);
	}
	public function createPlan($total,$planName)
	{

    	$total = (int) ( $total * 100 );

		return $this->PagarMe->plans()->create([
			'amount' => $total,
			'days' => '30',
			'name' => $planName,
			"payment_methods" => [
				"boleto",
				"credit_card"
			  ],
		]);
	}


	public function cancelSubscription($id)
	{	
		return $this->PagarMe->subscriptions()->cancel([
			'id' => $id
		]);
	}
	public function listPlans()
	{	
		return $this->PagarMe->plans()->getList();
	}
	public function subscriptionTransactions(User $user)
	{	
		if(!$user->subscription_id) return [];
		return $this->PagarMe->subscriptions()->transactions([
			'subscription_id' => $user->subscription_id
		  ]);
	}
	public function subscribeToPlan($user,$plan_id,$method,$card_id)
	{	

		$address = CreditCard::where('card_id',$card_id)->first();

		$obj = [
			'plan_id' => $plan_id,
			'payment_method' => $method,
			  'card_id' => $method == 'credit_card' ? $card_id : null,
			// 'card_hash' => $method == 'credit_card' ? $card_hash : null,
			'async' => true,
		
			'postback_url' => 'https://api.chefedeplantao.com.br/api/payment-postback',
			'customer' => [
			  'email' => $user->email,
			  'name' => $user->name,
			  'document_number' => $user->cpf,
				//   'document_number' => '75948706036',
				'address' => [
					'street' => $address->street,
					'street_number' => $address->street_number,
					'complementary' => '',
					'neighborhood' => $address->neighborhood,
					'zipcode' => $address->zip_code,
				],
				  'phone' => [
					'ddd' => '11',
					'number' => '999999999'
				  ],
				//   'sex' => 'other',
				//   'born_at' => '1970-01-01',
			],
			'metadata' => [
			  'user_id' => $user->id
			]
			];



		// dd($obj);

		return $this->PagarMe->subscriptions()->create($obj);
	}

	public function getSubscription($id)
    {

		return $this->PagarMe->subscriptions()->get([
			'id' => $id
		]);

    }


	


	public function postbacksValidate($postbackPayload, $signature)
    {
     return $this->PagarMe->postbacks()->validate($postbackPayload, $signature);

    }
   
}
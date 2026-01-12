<?php
namespace App\Services;

use Illuminate\Http\Request;

use Exception;

use App\Models\User;



class StripeService{

    private $api_key;

    //LIVE
    // CHAVE PUBLICÁVEL pk_live_51JFVpcCE5yS5BTonEuJsc1kVoxJRT8YESfV3yUevj4MX5h2UwC9SLkfUK6rNGUQXeEmBqQjgOdE2ro251kjlWfF700dgb9VaxZ

    // CHAVE SECRETA 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



    //TESTE
    //pk_test_51JFVpcCE5yS5BTon6pwUvYr7Uhpa2mfqkGerJFpRNO0TYa24tpilzB57K6Qlh5T9QtxQ1XGEjSjWbcYCckwNkOsI007GKE5M8U

    //sk_test_51JFVpcCE5yS5BTonZeiqxrqW3pJ5rNeTiyBDx92SyWvYDezad2Fh0Q6W7MgcUfJxQwKe93L2MYZBMiBct2IvKmJE00movBcgiK


    public function __construct()
    {
        //\Stripe\Stripe::setApiKey(env('STRIPE_KEY'));

        $this->stripe = new \Stripe\StripeClient(env('STRIPE_KEY'));
    

    }



    public function treatWebhookEvent($payload){
          return \Stripe\Event::constructFrom(
            $payload
          );
    }   




    public function createPayment(){

          return $this->stripe->paymentIntents->create([
      'amount' => 2000,
      'currency' => 'brl',
        ]);
        
    }

    public function getPaymentMethods($customerId) {

      return $this->stripe->paymentMethods->all([
        'customer' => $customerId,
        'type' => 'card',
      ]);
    }

    public function updateCostumer($stripeId, $paymentMethodId){

      return $this->stripe->customers->update(
        $stripeId,
        ['payment_method' => $paymentMethodId]
      );

      
  }

  public function createCostumer($name, $email){

    return $this->stripe->customers->create([
      'name' => $name,
      'email' => $email
    ]);

  }


     public function getInvoice($latest_invoice){

        return $this->stripe->invoices->retrieve(
          $latest_invoice,
          []
        );
    }


    public function getPaymentSources($customer_id){

      $stripe = new \Stripe\StripeClient( env('STRIPE_KEY') );
      return $this->stripe->customers->allSources(
        $customer_id,
        ['object' => 'card', 'limit' => 50]
      );
    }

    public function getPaymentMethod($method_id){
     return $this->stripe->paymentMethods->retrieve(
      $method_id,
        []
      );


    }


    public function getSubscriptions($subscription_id)
    {

      return  $this->stripe->subscriptions->retrieve(
        $subscription_id,
        []
      );

    }
    public function updatedSubscriptions($subscription_id,$paymentMethodId)
    {
      $data = [
        'default_payment_method' => $paymentMethodId
      ];

      return $this->stripe->subscriptions->update(
        $subscription_id,
        $data
      );

    }
    public function createSubscriptions($costumer_id)
    {

        $product = $this->stripe->products->create([
        'name' => 'Devotee Plano Premium',
        ]);

        $price = $this->stripe->prices->create([
          'unit_amount' => 100,
          'currency' => 'brl',
          'recurring' => ['interval' => 'day'],
          'product' => $product->id,
        ]);

        // $price_id = 'price_1JfBXCCE5yS5BToncLNc1wrA'; //diario

        //$price_id = 'price_1JeSF3CE5yS5BTonlrcgLKm9';  //mensal

        $price_id = $price->id;
        

        return $this->stripe->subscriptions->create([
          'customer' => $costumer_id,
          'payment_behavior' => 'default_incomplete',
          'items' => [
            ['price' => $price_id],
          ],
        ]);


    }


    public function cancelSubscriptions($subs_id)
    {

       
        

        return $this->stripe->subscriptions->cancel(
          $subs_id,
          []
        );

        
    }

    public function PaymentIntent($payment_intent)
    {
        
          
          return $this->stripe->paymentIntents->retrieve(
            $payment_intent,
            []
          );
    }



   
   
}

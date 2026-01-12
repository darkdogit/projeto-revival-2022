<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


use App\Models\User;
use App\Models\ProfilePicture;
use App\Models\Disability;
use App\Models\MyHospitals;
use App\Models\MyThings;
use App\Models\MyCid;
use App\Models\MyMedicalProcedures;
use App\Models\MyDrugs;
use App\Models\CID;
use App\Models\Drugs;
use App\Models\Hospitals;
use App\Models\MedicalProcedures;
use App\Models\UserMatch;
use App\Models\Like;


use App\Models\UsersOld;
use App\Models\RelationshipCid;
use App\Models\RelationshipMedication;
use App\Models\RelationshipHospitals;
use App\Models\RelationshipMedicalProcedures;
use App\Models\UserLocation;
use App\Models\OldMatches;
use App\Models\Filters;

use App\Services\StripeService;

use App\Events\UserUpdated;

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Socialite;

class UserController extends Controller
{

    public function __construct(
        User $user,
        MyHospitals $myHospitals,
        MyCid $myCid,
        MyMedicalProcedures $myMedicalProcedures,
        MyDrugs $myDrugs,
        MyThings $myThings,
        StripeService $stripeService,
        UserMatch $match,
        Like $like,
        Filters $filters
    )


    {
        @$this->user_id = @auth()->guard('api')->user()->id;
        @$this->user = @auth()->guard('api')->user();
        $this->userModel = $user;
        $this->myHospitalsModel = $myHospitals;
        $this->myCidModel = $myCid;
        $this->myThingsModel = $myThings;
        $this->myMedicalProceduresModel = $myMedicalProcedures;
        $this->myDrugsModel = $myDrugs;
        $this->stripeServiceModel = $stripeService;
        $this->matchModel = $match;
        $this->likeModel = $like;
        $this->filtersModel = $filters;

    }

    public function cards(Request $request)
    {
        //dd($this->user_id);
        if ($this->user_id) {

            $filtersCID = $this->filtersModel->where('user_id', $this->user_id)
            ->where('type', 'cid')
            ->pluck('filter_id')
            ->toArray();

            $filtersMedical_procedures = $this->filtersModel->where('user_id', $this->user_id)
            ->where('type', 'medical_procedures')
            ->pluck('filter_id')
            ->toArray();

            $filtersHospitals = $this->filtersModel->where('user_id', $this->user_id)
            ->where('type', 'hospitals')
            ->pluck('filter_id')
            ->toArray();

            $filtersDrugs = $this->filtersModel->where('user_id', $this->user_id)
            ->where('type', 'drugs')
            ->pluck('filter_id')
            ->toArray();

            $filtersThings = $this->filtersModel->where('user_id', $this->user_id)
            ->where('type', 'things_i_use')
            ->pluck('filter_id')
            ->toArray();

        }
        
        //dd($filtersDrugs);
        if ($this->user->account_type != 'curious') {

            if(!$this->user->lat OR !$this->user->lng){

            return ['status' => false, 'message' => 'Usuário sem Localização cadastrada'];
            }
            
        }
        

        if ($this->user->account_type != 'curious') {
            $users = User::with('profile_picture')->orderBy('distance','asc');
        }else{
            $users = User::with('profile_picture');
        }
        
        if ($this->user->target_gender != 'all') {

            $users->where('show_as_gender',$this->user->target_gender); // somente usuarios do genero que ele tem interesse
        }

        // remover depois que nenhum usuario achar o outro
        if (@$filtersCID) {

            $users->whereIn('id', function($in) use ($filtersCID) {
                //$in->select('user_id')->from('relationship_cid')->where('cid_id', $filtersCID);
                $in->select('user_id')->from('my_cids')->where('cid_id', $filtersCID);
                
            });
        }

        if (@$filtersMedical_procedures) {

            $users->whereIn('id', function($in) use ($filtersMedical_procedures) {
                //$in->select('user_id')->from('relationship_surgeries')->where('surgerie_id', $filtersMedical_procedures);
                $in->select('user_id')->from('my_medical_procedures')->where('medical_procedures_id', $filtersMedical_procedures);

            });
        }

        if (@$filtersHospitals) {

            $users->whereIn('id', function($in) use ($filtersHospitals) {
                //$in->select('user_id')->from('relationship_hospitals')->where('hospital_id', $filtersHospitals);
                $in->select('user_id')->from('my_hospitals')->where('hospital_id', $filtersHospitals);

            });
        }

        if (@$filtersDrugs) {
           
            $users->whereIn('id', function($in) use ($filtersDrugs) {
                $in->select('user_id')->from('my_drugs')->where('drug_id', $filtersDrugs);
            });

        }
        if (@$filtersThings) {

            $users->whereIn('id', function($in) use ($filtersThings) {
                //$in->select('user_id')->from('relationship_things')->where('things_i_use_id', $filtersThings);
                $in->select('user_id')->from('my_things')->where('things_i_use_id', $filtersThings);

            });
        }


        if ($this->user->show_as_gender) {
            $users->where('target_gender',$this->user->show_as_gender); // somente usuarios que tem interesse no genero dele

            //else para continuar caso o usuario seja curioso
        }
        

        if ($this->user->target_account_type != 'all') {


            $users->where('account_type',$this->user->target_account_type); // se o target_account_type for diferente de all, ele vai filtar pelo tipo de usuario
        }

        if ($this->user->relationship_type != 'all') {


            $users->where(function($query){

                $query->where('relationship_type', $this->user->relationship_type);
                $query->orWhere('relationship_type', 'all');

            });
        }


        $users->where('id', '!=', $this->user_id); // Nao aparecer eu mesmo na lista
        $users->where('show_me',  true); // quando o usuario nao quiser aparecer no devote
        $users->where('account_type', '!=', 'curious'); // quando o usuario nao quiser aparecer no devote

        $users->whereNotExists(function($query) // pega somente usuarios que o usuario nao deu like ou dislike
        {
            $query->select(DB::raw(1))
                  ->from('likes')
                  ->where('likes.user_id',$this->user_id)
                  ->whereRaw('likes.target_user = users.id');
        });

        //var_dump($this->user->lng);die();
        if ($this->user->account_type != 'curious') {
            $users->distance($this->user->lat, $this->user->lng); // calcula a distancia entre os usuarios achados e o usuario que fez a solicitacao
        }
        $users->where(function($query){ // pega somente usuarios com a idade correta

            $query->whereRaw('year(users.birthdate) <= ' . ((int)date("Y") - $this->user->age_min));
            $query->whereRaw('year(users.birthdate) >= ' . ((int)date("Y") - $this->user->age_max));

        });


        if ($this->user->account_type != 'curious') {
            $users->having('distance', '<=', $this->user->max_distance); // pega somente usuarios com a distancia maxima cadastrada
        }

        // $users = $users->get();
        //  return ['status' => true, 'data' => $users];

        $users = $users->paginate(200);
        $data = collect(['status' => true]);
        $data = $data->merge($users);
        return response()->json($data);

       


    }

    public function index(Request $request)
    {
        $user = $this->userModel->with('my_cids')
        ->with('my_hospitals')
        ->with('my_drugs')
        ->with('my_things')
        ->with('medical_procedures');

        if ($request->has('withTrashed')) {
            $user->withTrashed();
        }
        if ($request->has('onlyTrashed')) {
            $user->onlyTrashed();
        }


        if ($request->type) {
            $user->where('type', $request->type);
        }
        if ($request->q) {
            $user->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%")
                ->orWhere('email', 'like', "%{$request->q}%");
            });
        }

        if ($request->email) {
            $user->where('email', $request->email);
        }

        $list = $request->orderByDirection ? $request->orderByDirection : 'desc';

        $orderBy = $request->orderBy ? $request->orderBy : 'id';

        $user->orderBy($orderBy, $list);

        $user = $user->paginate(100);

        for ($i=0; $i < count(@$user); $i++) {

            $user[$i]->matches = $this->matchModel->countMatches($user[$i]->id);
            $user[$i]->liked_you = $this->likeModel->countLikedYou($user[$i]->id);
            $user[$i]->you_liked = $this->likeModel->countYouLiked($user[$i]->id);

        }

        $data = collect(['status' => true]);
        $data = $data->merge($user);

        return response()->json($data);
    }


    public function show($id,Request $request)
    {


        $user = User::
        with('profile_picture')
        ->with('my_cids')
        ->with('my_hospitals')
        ->with('my_drugs')
        ->with('medical_procedures')
        ->with('my_things')
        ->withTrashed()
        ->find($id);

        $user->matches = $this->matchModel->countMatches($user->id);
        $user->liked_you = $this->likeModel->countLikedYou($user->id);
        $user->you_liked = $this->likeModel->countYouLiked($user->id);

        return ['status' => true, 'data' => $user];


    }


    public function store(Request $request)
    {
        if ($request->login_type === 'google') {

            // $response = ['status' => false, 'message' => 'Error'];
            // return $response;

            $verify = $this->googleVerifyToken($request->token);
            //dd($verify);die();
            if(!isset($verify->email)){
                return ['status'=> false, 'message' => 'Ocorreu algum erro com a validação do Google.'];
            }
            if($verify->email != $request->email){
              return ['status'=> false, 'message' => 'Email de login diferente do email do Google.'];
            }

            //$user = Socialite::driver('google')->user();


            $dataUser = request()->validate([
                'name'      =>  'nullable',
                'email'     =>  'required|email',
                'type'      =>  'nullable',
                'birthdate' =>  'nullable',
                'notification_token' =>  'nullable',
                'gender' =>  'nullable',
                'show_as_gender' =>  'nullable',
                'sexual_orientation' =>  'nullable',
                'target_gender' =>  'nullable',
                'lat' =>  'nullable',
                'lng' =>  'nullable',
                'age_min' =>  'nullable',
                'age_max' =>  'nullable',
                'max_distance' =>  'nullable',
                'account_type' =>  'nullable',
            ]);

            $exist = $this->userModel->registeredEmail($verify->email);

            if ($exist) {

                $find = User::where('email', $request->email)->firstOrFail();
                $access_token = $find->createToken('authToken')->accessToken;
                $user = $find;
                
                $response = ['status' => true, 'data' => $user, 'access_token' => $access_token];
                return $response;
            }

            $dataUser['email'] = $verify->email;
            $dataUser['name'] = @$verify->name;

            $user =  User::create($dataUser);
            $user->email_verified_at = null;

            $accessToken = $user->createToken('authToken')->accessToken;

            $response = ['status' => true, 'data' => $user, 'access_token'=>$accessToken];
            return $response;


        }


        elseif ($request->login_type === 'apple') {

            //$verify = $this->googleVerifyToken($request->token);

            $dataUser = request()->validate([
                'name'      =>  'nullable',
                'email'     =>  'required|email',
                'type'      =>  'nullable',
                'birthdate' =>  'nullable',
                'notification_token' =>  'nullable',
                'gender' =>  'nullable',
                'show_as_gender' =>  'nullable',
                'sexual_orientation' =>  'nullable',
                'target_gender' =>  'nullable',
                'lat' =>  'nullable',
                'lng' =>  'nullable',
                'age_min' =>  'nullable',
                'age_max' =>  'nullable',
                'max_distance' =>  'nullable',
                'account_type' =>  'nullable',
            ]);


            $exist = $this->userModel->registeredEmail($request->email);

            if ($exist) {
                return ['status' => false, 'message' => 'Email em uso'];
            }


            $user =  User::create($dataUser);
            $user->email_verified_at = null;

            $accessToken = $user->createToken('authToken')->accessToken;

            $response = ['status' => true, 'data' => $user, 'access_token'=>$accessToken];
            return $response;


        }




        else{

            $dataUser = request()->validate([
                'name'      =>  'nullable',
                'password'  =>  'required|min:8',
                'email'     =>  'required|email',
                'type'      =>  'nullable',
                'birthdate' =>  'nullable',
                'notification_token' =>  'nullable',
                'gender' =>  'nullable',
                'show_as_gender' =>  'nullable',
                'sexual_orientation' =>  'nullable',
                'target_gender' =>  'nullable',
                'lat' =>  'nullable',
                'lng' =>  'nullable',
                'age_min' =>  'nullable',
                'age_max' =>  'nullable',
                'max_distance' =>  'nullable',
                'account_type' =>  'nullable',

            ]);

            $dataUser['password'] = bcrypt( $request->password);

            $exist = $this->userModel->registeredEmail($request->email);

            if ($exist) {
                return ['status' => false, 'message' => 'Email em uso'];
            }

            $user =  User::create($dataUser);
            $user->email_verified_at = null;

            $accessToken = $user->createToken('authToken')->accessToken;



            $response = ['status' => true, 'data' => $user, 'access_token'=>$accessToken];
            return $response;

        }

    }

    // public function updatePass(Request $request)
    // {
    //     $user = User::where('email', $request->email)->first();

    //     //dd($request->email);

    //     $request->merge(
    //         ['password' => bcrypt($request->password)
    //     ]);

    //     $user->update($request->all());

    // }

    public function update(Request $request, $id)
    {

        // dd(array_map(function ($thing){

        // }, $request['things_i_use']));

        $user = User::find($id);


        if ($request->password) {

            request()->validate([
                'password'      =>  'required|min:8'
            ]);

            if (password_verify($request->old_password, $user->password)) {

                $request->merge(
                    ['password' => bcrypt($request->password)
                ]);

            } else {

                $response = ['status' => false, 'message' => 'Credenciais inválidas'];
                return $response;
            }

        }

        if(isset($request->active)){ //deslogar o cara que for desativado

            if($request->active == false){
                DB::table('oauth_access_tokens')->where('user_id',$id)->delete();
           
              

                // $randonString = Str::random(40);
                // $new_email =  $randonString.'@devotee.com';

                // $request->merge(
                //         ['email' => $new_email
                //     ]);

                if (($user->id != $this->user->id) AND ($this->user->type != 'admin')) {

                    $response = ['status' => false, 'message' => 'Este usuario nao tem permissao para desativar essa conta'];

                    return $response;
                }
            }

            
        }



        if (@$request->file('image')) {

            $insert = [];

            for ($i=0; $i < count($request->file('image')); $i++) {


                if ($i === 0) { $main = true; }else { $main = false;}

                $insert[$i] =  ProfilePicture::create([
                    'user_id' => $id,
                    'main' => @$main,
                    'order' => $i,
                ]);

                if ($request->file('image')[$i]->isValid()) {

                    $ext = $request->file('image')[$i]->guessExtension();
                    if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';

                    $up = $this->upload( $request->file('image')[$i], $insert[$i]->id.'_'.rand(10,99999), $request->request_id, $ext);

                    $insert[$i]->path =  $up;
                    $insert[$i]->save();

                 }


            }
        }

        if (@$request->disability) {
            //var_dump($request->disability);die();
            $this->saveDisability(@$request->disability, $id);
        }

        if (!$request->name) {
            $request->offsetUnset('name');
        }

        if (!$request->email) {
            $request->offsetUnset('email');
        }
        
        $user->update($request->all());

        //7811
        // $event = event(new UserUpdated($user));


        $response = ['status' => true, 'data' => $user];
        return $response;
    }

    public function saveDisability($disability, $id)
    {

        if (isset($disability['hospitals'])) {

            $this->myHospitalsModel->remove($id);

            for ($i=0; $i < count(@$disability['hospitals']); $i++) {

                MyHospitals::updateOrCreate(
                    [
                        'user_id' => $id,
                        'hospital_id' => $disability['hospitals'][$i]['id'],
                    ],
                    [
                        'user_id' => $id,
                        'hospital_id' => $disability['hospitals'][$i]['id'],
                    ]
                );
            }
        }

        if (isset($disability['cid'])) {

            $this->myCidModel->remove($id);

            for ($i=0; $i < count($disability['cid']); $i++) {

                MyCid::updateOrCreate(
                    [
                        'user_id' => $id,
                        'cid_id' => $disability['cid'][$i]['id'],
                    ],
                    [
                        'user_id' => $id,
                        'cid_id' => $disability['cid'][$i]['id'],
                    ]
                );
            }
        }

        if (isset($disability['medical_procedures'])) {

            $this->myMedicalProceduresModel->remove($id);

            for ($i=0; $i < count($disability['medical_procedures']); $i++) {



                MyMedicalProcedures::updateOrCreate(
                    [
                        'user_id' => $id,
                        'medical_procedures_id' => $disability['medical_procedures'][$i]['id'],
                    ],
                    [
                        'user_id' => $id,
                        'medical_procedures_id' => $disability['medical_procedures'][$i]['id'],
                    ]
                );
            }
        }

        if (isset($disability['drugs'])) {

            $this->myDrugsModel->remove($id);


            for ($i=0; $i < count($disability['drugs']); $i++) {

                MyDrugs::updateOrCreate(
                    [
                        'user_id' => $id,
                        'drug_id' => $disability['drugs'][$i]['id'],
                    ],
                    [
                        'user_id' => $id,
                        'drug_id' => $disability['drugs'][$i]['id'],
                    ]
                );
            }
        }
        if (isset($disability['things_i_use'])) {

            // se der merda, é culpa do andrews

            $this->myThingsModel->remove($id);
            $items = array_map(function($thing) use($id) {
                return [
                    'user_id' => $id,
                    'things_i_use_id' => $thing['id'],
                ];
            }, $disability['things_i_use']);

            $this->myThingsModel->insert($items);
        }
    }

    public function removeHospitals(Request $request)
    {
        if (@!$this->user) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyHospitals::where('user_id', $this->user->id)
            ->where('hospital_id', $request->hospital_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }

    public function removeCid(Request $request)
    {
        if (@!$this->user) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyHospitals::where('user_id', $this->user->id)
            ->where('hospital_id', $request->hospital_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }



    public function registeredEmail(Request $request)
    {
        $exist = $this->userModel->registeredEmail($request->email);
        $response = ['status' => true, 'registered' => $exist];
        return $response;
    }

 
    public function destroy($id,Request $request){


        if ($id == @$this->user->id) {

            $user = User::find($id);
            $user->delete();

            DB::table('oauth_access_tokens')->where('user_id',$id)->delete();

            return ['status' => true, 'deleted' => (boolean) $user];
        } else {
            return [
                'status' => false, 
                'message' => 'Erro na solicitaçāo, entre em contato com um administrador.', 
                'error' => 'Erro na solicitaçāo, entre em contato com um administrador.'
            ];
        }

    }

    // private function updateUserPaymentMethod(User $user,$method_id){

    //     // $costumer = $this->stripeServiceModel->updateCostumer(
    //     //     $user->stripe_id, $method_id
    //     // );


    //     $subscription = $this->stripeServiceModel->updatedSubscriptions(
    //         $user->subscriptions_id, $method_id
    //     );

    //     return $subscription;


    // }


    // public function addPaymentMethod(Request $request)
    // {
    //     request()->validate([
    //         'payment_method_id'      =>  'required',
    //     ]);

    //     $user = User::find(@$this->user_id);

    //     if (!$user->stripe_id) {
    //         return ['status' => false, 'message' => 'Usuário não está cadastrado na API de pagamento.'];
    //     }


    //         $costumer = $this->stripeServiceModel->updateCostumer(
    //             $user->stripe_id, $request->payment_method_id
    //         );
    //         $user->stripe_id = $costumer->id;
    //         $user->save();

    //         $subscription = $this->stripeServiceModel->updatedSubscriptions(
    //             $user->subscription_id, $request->payment_method_id
    //         );

    //         return ['status' => true, 'data' => $costumer];


    // }

    public function paymentConcluded(Request $request){

        $user = User::find($this->user_id);

        if (!$user->stripe_id) {
            return ['status' => false, 'message' => 'Usuário não encontrado.'];
        }


        $sources = $this->stripeServiceModel->getPaymentSources($user->stripe_id);

        // dd($sources);

        $subscription = $this->stripeServiceModel->getSubscriptions($user->subscriptions_id);

        $invoice = $this->stripeServiceModel->getInvoice($subscription->latest_invoice);

        // dd($invoice);

        $intent = $this->stripeServiceModel->PaymentIntent($invoice->payment_intent);

        // dd($intent);

        return [

            'sources' => $sources,
            'subscription' => $subscription,
            'invoice' => $invoice,
            'intent' => $intent,


        ];

        // $methods = $this->stripeServiceModel->getPaymentMethods($user->stripe_id);

        // if(count($methods->data)){

        //     $pm_id = $methods->data[0]->id;

        //     $method = $this->updateUserPaymentMethod($user, $pm_id);

        //     return ['status' => true, 'data' => $method];


        // } else{
        //     return ['status' => false, 'message' => 'Nenhum método de pagamento encontrado.'];

        // }



    }

    public function payment(Request $request)
    {

        if (!@$this->user_id) {
            return ['status' => false, 'message' => 'Usuário invalido'];
        }

        $user = User::find(@$this->user_id);

        if ($user->plan_type === 'premium') {
            return ['status' => false, 'message' => 'Esse usuario ja possui um plano premium'];
        }

        // if (!$user->stripe_id) {
            $costumer = $this->stripeServiceModel->createCostumer($user->name, $user->email);
            $user->stripe_id = $costumer->id;
        // }

        // if (!$user->subscriptions_id) {
            $subscription = $this->stripeServiceModel->createSubscriptions($user->stripe_id);

            $user->subscriptions_id = $subscription->id;
            $user->save();
        // } else {
        //     $subscription = $this->stripeServiceModel->getSubscriptions($user->subscriptions_id);

        // }

        $invoice = $this->stripeServiceModel->getInvoice($subscription->latest_invoice);

        $PaymentIntent = $this->stripeServiceModel->PaymentIntent($invoice->payment_intent);

        return ['status' => true, 'data' => $PaymentIntent, 'invoice'=>$invoice, 'subscription'=>$subscription];

    }

    public function cancelSubs(Request $request)
    {


        if (!@$this->user_id) {
            return ['status' => false, 'message' => 'Usuário invalido'];
        }

        $user = User::find(@$this->user_id);

        if ($user->plan_type === 'free' OR !$user->subscriptions_id) {
            return ['status' => false, 'message' => 'Este usuario nao tem uma assinatura ativa'];
        }


        $cancelSubs = $this->stripeServiceModel->cancelSubscriptions($user->subscriptions_id);

        if ($cancelSubs) {

            $user->reason_cancel_plan = $request->reason_cancel_plan;
            $user->plan_type = 'free';

            $user->subscriptions_id = null;
            $user->save();
        }

        return ['status' => true, 'data' => $cancelSubs];


    }



    public function upload($file, $name, $requestId, $ext)
    {

        $filename = md5($name).".".$ext;
        $docFile =  'profile_pictures/'.$filename;
        $go = Storage::disk('s3')->put($docFile , file_get_contents($file),'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }

    private function googleVerifyToken($token){

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => "https://oauth2.googleapis.com/tokeninfo?id_token=".$token,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "",
        CURLOPT_HTTPHEADER => array(
            "accept: application/json",
            "content-type: application/json"
        ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        return json_decode($response);
    }

    public function migraUser()
    {

        $old = UsersOld::get();

        for ($i=0; $i < count($old); $i++) {


            if ($old[$i]->user_type == 1) {
                $user_type = 'special';
            }

            if ($old[$i]->user_type == 2) {
                $user_type = 'devotee';
            }

            if ($old[$i]->gender != 'female' AND $old[$i]->gender != 'male') {
                $show_as_gender = null;
            }else{
                $show_as_gender = $old[$i]->gender;
            }


            if (!$old[$i]->state) {
                $address_description = $old[$i]->city;
            }else{
                $address_description = $old[$i]->state. '-'.$old[$i]->city;
            }

            if (!$old[$i]->tiic) {
                $tiic = false;
            }
             if (!$old[$i]->prejudice) {
                $prejudice = false;
            }



           if (!$this->validateDate($old[$i]->birthdate)) {


               $old[$i]->birthdate = null;
           }
           if ($old[$i]->birthdate === '0000-00-00') {
                $old[$i]->birthdate = null;
            }



           //var_dump($old[$i]->birthdate);die();


            $data = array(
                'old_id' => $old[$i]->id,
                'email' => $old[$i]->email,
                'legacy_user' => 1,
                'name' => $old[$i]->first_name.' '.$old[$i]->last_name,
                'gender' => $old[$i]->gender,
                'show_as_gender' => $show_as_gender,
                'address_description' => $address_description,
                'about' => $old[$i]->about,
                'birthdate' => $old[$i]->birthdate,
                'account_type' => $user_type,
                'prejudice' => $prejudice,
                'tiic' => $tiic,
                'occupation' => $old[$i]->profession,
            );

            if (!$this->userModel->registeredEmail($old[$i]->email)) {
                User::create($data);
            }
        }

    }

    function validateDate($date)
    {
        $timestamp = strtotime($date);
        return $timestamp ? $date : null;
    }

    function migraCidUser()
    {
        $user = $this->userModel->select('old_id','id')->get();

         for ($i=0; $i < count($user); $i++) {

            $this->pegaCid($user[$i]->old_id, $user[$i]->id);
        }

    }

    function pegaCid($old_id, $user_id)
    {

        $relCid = RelationshipCid::where('user_id', $old_id)->get();

        if ($relCid) {

            for ($i=0; $i < count($relCid); $i++) {

                    if (CID::where('id', $relCid[$i]->cid_id)->exists()) {

                        $user = MyCid::firstOrNew(
                        [
                            'user_id' => $user_id,
                            'cid_id' => $relCid[$i]->cid_id,
                        ],
                        [
                            'user_id' => $user_id,
                            'cid_id' => $relCid[$i]->cid_id,
                        ]
                        )->save();

                    }
            }

        }
    }


    function migraDrugUser()
    {
        $user = $this->userModel->select('old_id','id')->get();

         for ($i=0; $i < count($user); $i++) {

            $this->pegaDrug($user[$i]->old_id, $user[$i]->id);
        }

    }

    function pegaDrug($old_id, $user_id)
    {

        $relMed= RelationshipMedication::where('user_id', $old_id)->get();

        if ($relMed) {

            for ($i=0; $i < count($relMed); $i++) {

                    if (Drugs::where('id', $relMed[$i]->medication_id)->exists()) {

                        $user = MyDrugs::firstOrNew(
                            [
                                'user_id' => $user_id,
                                'drug_id' => $relMed[$i]->medication_id,
                            ],
                            [
                                'user_id' => $user_id,
                                'drug_id' => $relMed[$i]->medication_id,
                            ]
                        )->save();

                    }
            }

        }
    }



    function migraHospUser()
    {
        $user = $this->userModel->select('old_id','id')->get();

         for ($i=0; $i < count($user); $i++) {

            $this->pegaHosp($user[$i]->old_id, $user[$i]->id);
        }

    }

    function pegaHosp($old_id, $user_id)
    {

        $relMed= RelationshipHospitals::where('user_id', $old_id)->get();

        if ($relMed) {

            for ($i=0; $i < count($relMed); $i++) {

                    if (Hospitals::where('id', $relMed[$i]->hospital_id)->exists()) {

                        $user = MyHospitals::firstOrNew(
                            [
                                'user_id' => $user_id,
                                'hospital_id' => $relMed[$i]->hospital_id,
                            ],
                            [
                                'user_id' => $user_id,
                                'hospital_id' => $relMed[$i]->hospital_id,
                            ]
                        )->save();

                    }
            }

        }
    }



    function migraMedicalProceduresUser()
    {
        $user = $this->userModel->select('old_id','id')->get();

         for ($i=0; $i < count($user); $i++) {

            $this->pegaMedical($user[$i]->old_id, $user[$i]->id);
        }

    }

    function pegaMedical($old_id, $user_id)
    {

        $relMed= RelationshipMedicalProcedures::where('user_id', $old_id)->get();

        if ($relMed) {

            for ($i=0; $i < count($relMed); $i++) {

                    if (MedicalProcedures::where('id', $relMed[$i]->surgerie_id)->exists()) {

                        $user = MyMedicalProcedures::firstOrNew(
                            [
                                'user_id' => $user_id,
                                'medical_procedures_id' => $relMed[$i]->surgerie_id,
                            ],
                            [
                                'user_id' => $user_id,
                                'medical_procedures_id' => $relMed[$i]->surgerie_id,
                            ]
                        )->save();

                    }
            }

        }
    }

    function migraLat()
    {
        $user = $this->userModel->select('old_id','id')->get();

         for ($i=0; $i < count($user); $i++) {

            $this->pegaLat($user[$i]->old_id, $user[$i]->id);
        }

    }

    function pegaLat($old_id, $user_id)
    {

        $lat = UserLocation::where('userId', $old_id)->orderBy('id', 'desc')->first();

        var_dump($lat);die();




        // if ($relMed) {

        //     for ($i=0; $i < count($relMed); $i++) {

        //             if (MedicalProcedures::where('id', $relMed[$i]->surgerie_id)->exists()) {

        //                 $user = MyMedicalProcedures::firstOrNew(
        //                     [
        //                         'user_id' => $user_id,
        //                         'medical_procedures_id' => $relMed[$i]->surgerie_id,
        //                     ],
        //                     [
        //                         'user_id' => $user_id,
        //                         'medical_procedures_id' => $relMed[$i]->surgerie_id,
        //                     ]
        //                 )->save();

        //             }
        //     }

        // }
    }


    function migraMatch()
    {
        $count = 0;
        $user = $this->userModel->select('old_id','id')->get();

        $matches = OldMatches::get();

        //$a = $this->userModel->newId(4941);

        //dd($matches);die();

        for ($i=0; $i < count($matches); $i++) {

            $user_a = $this->userModel->newId($matches[$i]->user_id);
            $user_b = $this->userModel->newId($matches[$i]->receive_id);

            //var_dump($user_a);die();

            if ($user_a === NULL OR $user_b=== NULL) {

                $count++;

            }else{

                //dd($user_b->id);die();

                $matchExist = $this->matchModel->matchExist($user_a->id, $user_b->id);

                if (!$matchExist) {

                   $this->matchModel->create([
                        'user_a' => $user_a->id,
                        'user_b' => $user_b->id
                    ]);
                }
            }
        }
    }



    function getSexualOrientation()
    {
        $user = $this->userModel->select('old_id','id')->whereNull('sexual_orientation')->get();

         //$this->pegasexual($user[0]->old_id, $user[0]->id);


         for ($i=0; $i < count($user); $i++) {

            $sexual = $this->pegasexual($user[$i]->old_id, $user[$i]->id);
            $user[$i]->sexual_orientation = $sexual;
            $user[$i]->save();
        }

    }

    function pegasexual($old_id, $id)
    {

        $oldUser = UsersOld::where('id', $old_id)->first();

        if ($oldUser->sexualorientation === NULL) {
            return null;
        }else{
            return $oldUser->sexualorientation;
        }

    }


}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Like;
use App\Models\UserMatch;

use App\Events\NewMatchEvent;


use App\Services\NotificationService;


use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function __construct(NotificationService $notif)
    {
        $this->user_id = @auth()->guard('api')->user()->id;
        $this->user = @auth()->guard('api')->user();
        $this->push = $notif;
    }

    public function index(Request $request){


        $likes = Like::latest();

        
        if($request->user_id) $likes->where('user_id',$request->user_id);

        if($request->target_user) $likes->where('target_user',$request->target_user);
        

        if($request->type) $likes->where('type',$request->type);


         $likes = $likes->paginate(100);
        
         $data = collect(['status' => true]);
         $data = $data->merge($likes);

         return response()->json($data);

        
    }

    public function likedMe(Request $request){


        if (!@$this->user_id) {
           return ['status'=>false, 'message'=> 'Usuario invalido'];
        }

        $matches =  DB::table('likes')->where('user_id', '=', $this->user_id)->pluck('target_user');

        $likes = Like::latest();

        $likes->whereNotIn('target_user', $matches);

        $likes->where('target_user', $this->user_id);
        $likes->where('type', 'like');

        $likes->WhereHas('user', function($query)  {
            $query->whereNull('users.deleted_at');
        });

        $likes = $likes->get();

        return ['status'=>true,'data'=>$likes];
        
    }


    public function store(Request $request){

        $validate = request()->validate([
            'user_id'     =>  'required',
            'type'     =>  'required'
        ]);


        if ($request->type === 'super-match') {


            $mandatory_like = Like::firstOrNew([
                'user_id' => $request->user_id,
                'target_user' => $this->user_id,
                'type' => 'like'
            ]);
            $mandatory_like->save();

            $request->type = 'like';
        }




        $like = Like::firstOrNew([
            'user_id' => $this->user_id,
            'target_user' => $request->user_id,
        ]);
        $like->type = $request->type;
        $like->save();

   
        $user = User::find($request->user_id); // pega o usuario que recebeu like


        if($request->type == 'like'){ // se for um like verificar se é match
            //verify to create match
            $verify = Like::where([
                'user_id' => $request->user_id,
                'target_user' =>  $this->user_id,
            ])->count();

            if($verify){ // deu match!

                $match = UserMatch::updateOrCreate([
                    'user_a' => $this->user_id,
                    'user_b' => $request->user_id,
                ]);

                //var_dump($match->id);die();
    
                $this->push->new($user,'notification_match','Você teve um novo match!','Clique para saber mais',$like);
    
                 $matchEvent1 = event(new NewMatchEvent([ //socket pro usuario que deu like
                     'user_id' => $this->user_id,
                     'match_user' => $user,
                     'match_id' => $match->id,
                 ]));
                 $matchEvent2 = event(new NewMatchEvent([ //socket pro usuario que recebeu like
                    'user_id' => $user->id,
                    'match_user' => $this->user,
                    'match_id' => $match->id
                 ]));
    
            } else { // ainda nao deu match        
                $this->push->new($user,'notification_like','Alguem curtiu você!','Clique para saber mais',$like);
            }
        } else { // se for um dislike
            $verify = false;
        }

        /////////////////////////

        $response = $like->toArray();
        $response['is_match'] = (bool)$verify;

        if (@$verify) {
            $response['match_id'] = @$match->id;
        }

 
        return ['status'=>true,'data'=>$response];

    }

    public function resetDislikes(Request $request)
    {
        //dd($this->user_id);die();

        if (!@$this->user_id) {
           return ['status'=>false, 'message'=> 'Usuario invalido'];
        }

        $reset = Like::where('type', 'dislike')->where('user_id', $this->user_id)->delete();

        return [
            'status'=>true,
            'message'=>'Ok'
        ];
        
    }
}

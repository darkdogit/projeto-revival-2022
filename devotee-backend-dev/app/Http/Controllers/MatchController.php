<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Like;
use App\Models\UserMatch;

class MatchController extends Controller
{
    public function __construct()
    {
        $this->user_id = @auth()->guard('api')->user()->id;
        $this->user = @auth()->guard('api')->user();
    }

    public function index(Request $request){

        if($request->user_id){
            $user_id = $request->user_id;
        } else {
            if($this->user->type == 'user'){
                $user_id = $this->user_id;
            } else {
                $user_id = null;
            }
        }


        $matches = UserMatch::latest();


        if($user_id){

            $matches->where(function($query) use($user_id){
                $query->where('user_a',$user_id);
                $query->orWhere('user_b',$user_id);
            });
        }

        if ($request->q) {

            $matches->WhereHas('user_b', function($query) use ($request) {
                $query->where('users.name', 'like', "%{$request->q}%");
            });

            $matches->orWhereHas('user_a', function($query) use ($request) {
                $query->where('users.name', 'like', "%{$request->q}%");
            });
        }

        $matches->where('active', true);

        $matches = $matches->paginate(100);

        //dd($matches[26]);
        //$matches = $matches->get();

        $response = [];
        if($user_id){
            foreach($matches as $m){

                $m = (object)$m->toArray();
              


                //var_dump($m->user_a['id']);die();
                //var_dump($user_id);die();

                // if ($m->user_a['id'] == $user_id){
                //     //para nao ir target_user null pro app pra nao crashar
                //     if(@$m->user_b) {
                //         $response[] = [
                //             'match_id' => $m->id,
                //             'target_user' => $m->user_b,
                //             'latest_message' => $m->latest_message,
                //         ];
                //     }
                // }

                //dd($response);

                if(@$m->user_a['id'] == $user_id){

                    //para nao ir target_user null pro app pra nao crashar
                    if(@$m->user_b) {
                        $response[] = [
                            'match_id' => $m->id,
                            'target_user' => $m->user_b,
                            'latest_message' => $m->latest_message,
                        ];
                    }

                    

                }
                else if (@$m->user_b['id'] == $user_id){
                    
                    //para nao ir target_user null pro app pra nao crashar
                    if (@$m->user_a) {
                        $response[] = [
                            'match_id' => $m->id,
                            'target_user' => $m->user_a,
                            'latest_message' => $m->latest_message
                        ];
                    }
                    
                }
            }
        } else {
            $response = $matches;
        }


        //var_dump(count($matches));die();
       
        return ['status'=>true,'data'=>$response];

    }

    public function show($id){

 

        $m = UserMatch::find($id);

        ///
        $response = [];
        $m = (object)$m->toArray();
        if($m->user_a['id'] == $this->user_id){
            $response = [
                'match_id' => $m->id,
                'target_user' => $m->user_b,
                'latest_message' => $m->latest_message,
            ];
        } else if ($m->user_b['id'] == $this->user_id){
            $response = [
                'match_id' => $m->id,
                'target_user' => $m->user_a,
                'latest_message' => $m->latest_message
            ];
        }
        
       
        ///
        return ['status'=>true,'data'=>$response];

    }

    public function destroy($id){
        return ['status' => true,'data' => UserMatch::where('id',$id)->update(['active'=>false])];

    }
}

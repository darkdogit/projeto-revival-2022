<?php

namespace App\Http\Controllers;

use App\Models\MyCid;
use Illuminate\Http\Request;

class MyCidController extends Controller
{
    public function __construct(MyCid $myCid)
    {
        @$this->user_id = @auth()->guard('api')->user()->id;
        $this->myCidModel = $myCid;
    }



    public function removeCid(Request $request)
    {
        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyCid::where('user_id', $this->user_id)
            ->where('cid_id', $request->cid_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }
}

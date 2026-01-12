<?php

namespace App\Http\Controllers;

use App\Models\MyDrugs;
use Illuminate\Http\Request;

class MyDrugsController extends Controller
{
    public function __construct(MyDrugs $myDrugs)
    {
        @$this->user_id = @auth()->guard('api')->user()->id;
        $this->myDrugsModel = $myDrugs;
    }



    public function removeDrugs(Request $request)
    {
        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyDrugs::where('user_id', $this->user_id)
            ->where('drug_id', $request->drug_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\MyHospitals;
use Illuminate\Http\Request;

class MyHospitalsController extends Controller
{
    

    public function __construct(MyHospitals $myHospitals)/*, PagarMeService $pms*/
    {
        @$this->user_id = @auth()->guard('api')->user()->id;
        $this->myHospitalsModel = $myHospitals;
    }



    public function removeHospitals(Request $request)
    {
        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyHospitals::where('user_id', $this->user_id)
            ->where('hospital_id', $request->hospital_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }


}

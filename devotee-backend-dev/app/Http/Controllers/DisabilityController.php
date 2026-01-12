<?php

namespace App\Http\Controllers;

use App\Models\Disability;
use Illuminate\Http\Request;

class DisabilityController extends Controller
{


    public function __construct(Disability $disability)
    {
        $this->disabilityModel = $disability;
        $this->user_id = @auth()->guard('api')->user()->id;
    }
    

    public function update(Request $request, $id)
    {  
        $disability = $this->disabilityModel->updateOrCreate(
            ['user_id' => $id],
            [
                'name' => $request->name, 
                'cid' => $request->cid, 
                'medical_procedures' => $request->medical_procedures, 
                'medicament' => $request->medicament, 
                'hospital' => $request->hospital, 
            ]
        );

        $response = ['status' => true, 'data' => $disability];
        return $response;
        
    }

}

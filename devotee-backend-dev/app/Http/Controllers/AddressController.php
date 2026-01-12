<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\User;

use Illuminate\Http\Request;

class AddressController extends Controller
{
    private $userAddressModel;
    
    public function __construct(Address $userAddress)
    {
        $this->userAddressModel = $userAddress;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index(Request $request)
    {
        $userAddress = $this->userAddressModel->query();

        if (@$this->user_id) {
            $userAddress->where('user_id', $this->user_id);
        }
        $userAddress->where('active', true);


        $data = $userAddress->get();

        

        $response = ['status' => true, 'data' => $data];
        return $response;
    }

    public function show(UserAddress $userAddress, $id)
    {   
        $userAddress = $this->userAddressModel->findOrFail($id);
        $response = ['status' => true, 'data' => $userAddress];
        return $response;
    }


    public function store(Request $request)
    {
        $request->merge(['user_id' => $this->user_id]);
        $userAddress = $this->userAddressModel->create($request->all());


        $response = ['status' => true, 'data' => $userAddress];
        return $response;
    }

    public function update(Request $request, UserAddress $userAddress, $id)
    {
        $userAddress = $this->userAddressModel->find($id);

        $request->merge(['user_id' => $this->user_id]);

  
        $userAddress->update($request->all());

        $response = ['status' => true, 'data' => $userAddress];
        return $response;
    }

    public function destroy(UserAddress $userAddress, $id)
    {
        $userAddress = $this->userAddressModel->find($id);
        $userAddress->active = false;
        $userAddress->save();
        
        $response = ['status' => true, 'data' => $userAddress];
        return $response;
        
    }
}

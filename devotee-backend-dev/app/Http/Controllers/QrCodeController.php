<?php

namespace App\Http\Controllers;

use App\Models\QrCode;
use App\Http\Controllers\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\User;

use App\Events\LoginQrCodeEvent;




use Carbon\Carbon;

class QrCodeController extends Controller
{

//     Essa estrutura ainda nao foi criada, precisamos pensar em algo para implementação, pensando aqui rapidamente pelo fluxo, pensei no seguinte:
// Eu vou criar um endpoint, solicitar uma hash pro back end e criar um qr_code com essa hash, e no app ele vai ler esse qr_code, pegar essa hash, enviar pro back validar, e liberar o login, e um websocket para voces ficaram esperando a liberacao de login nessa pagina...
// Me confirma se isso é OK q eu crio assim, vou consultar os devs do app tbm



    public function __construct(QrCode $qrCode, AuthController $authController)
    {
        $this->qrCodeModel = $qrCode;
        $this->authController = $authController;
        $this->user_id = @auth()->guard('api')->user()->id;
    }
    
    public function createHash()
    {


        $string = Str::random(32);
        $create = array(
            'hash'      => $string,
        );

        // $qrCode = $this->qrCodeModel->updateOrCreate([
        //     'user_id'   => $this->user_id,
        //     ],$create
        // );

        $qrCode = $this->qrCodeModel->create($create);

        $response = ['status' => true, 'data' => $qrCode];
        return $response;
    }

    public function readHash(Request $request)
    {

        if (!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuario invalido'];
            return $response;
        }

        $valid = $this->validHash($request->hash, $this->user_id);



        if ($valid){

            $user = User::find($this->user_id);
            $token = request()->bearerToken();

            $response = array(
                'status' => true, 
                'data' => $user, 
                'access_token' => $token,
                'hash' => $request->hash,
            );

            $loginEvent = event(new LoginQrCodeEvent($response));
            return $response;

            
        }else{
            $response = ['status'=> false, 'message' => 'Credenciais inválidas'];
            return $response;
        }
       
    }

    public function validHash($hash, $user_id)
    {
        $now = Carbon::now()->addHour(3);

        $exist = $this->qrCodeModel->where('hash', $hash)
        ->whereNull('user_id')
        ->where('created_at', '<',  $now)
        ->first();

        if ($exist) {
            $exist->user_id = $user_id;
            $exist->save();
            return true;
        }else{
            return false;

        }

    }

}

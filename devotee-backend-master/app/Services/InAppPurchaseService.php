<?php
namespace App\Services;

use Illuminate\Http\Request;
use Exception;
use App\Models\User;



class InAppPurchaseService{

    // $privatekey = "-----BEGIN PRIVATE KEY-----
    // MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCl8hAIz+odHVMR
    // W8/XpUdqwwnHj4+t8zd2RdFWkaWg29x/iuk9z9YO4IXKwTDI226rI8t39U4b2c11
    // j9ZkDXCjdlaPJ+/iS7v4l+zM4X9/QLjT0/QiT3rEwRvfq/F51Mp2o/ECc3Wg5i+9
    // ln9uBPxzoJy76vC3D2+1HQup7ZWp95TIrVPFCvtBLAIjuCR7NiNbOngQr5GTEd/q
    // mMLEIuzX/1kOY/ug4xY2NacxtpnkgqWcykI3lKWQ5YgA9dSNYprAp7fDS069FNAS
    // Nwq63kmWR2JJq0CKG0dE78YekAxhqyJX874FPbZxqqH2Ea4YYJ62VpbcWg3OQm6V
    // YvHbKOv1AgMBAAECggEADyu3ClpmDvoiuvm6x/5eYUTdYwO3FFihrGVez8Kjv4LG
    // 5yR+HqsegnoSOsjSOrqc2BAYrN0ECNXIZV2cZJJtLSet0b6XI2532JbP2XDDS13r
    // LiprxxGfED4oDzKH8lkt/UF1nU5ZTASScfGm5E1kyvYjytlqq9tBNu+/cW4jLZUr
    // CsdMEY/fG6x16jf/HQMbTxTbJeRc6T6LwvOxIpDD4o+NPEbb1eYuj3s9DuFb9DhA
    // zk3LZ4+LcgLDTrD/EUKNeHZH/cNrE9+ONCp5JOJbKdyi2BK6Lq/aUBerXUz+qU1a
    // Kk7vLh31thcZ759XirdOYPfMLZ0it/qU0tArlWo3zQKBgQDnk6x9CDTT/5UUcsRL
    // Fkj9LTCSElKsqt/l9heoGwKm1nUCaH4VqjKN29FyiS1MK7qi3Rw2y6aWVP+fKWfA
    // UzyCsVIEhzWzyekXaWbdtwPLz3SKPlI0ZJnJtq8acNn7sP0J2/hBIOqJW0l3F1av
    // mFd6GJ0a6lUJcMIuXLpzS3iLRwKBgQC3cmoXvcmjvfaa9ULbIx2xANnjWMDX2VuP
    // FqIRvJJP5XvR1wXG7YlZPRSDHmnR+WCFzA3I4QpuOoNqqgc7Qs37w81r5O+nEEi/
    // VA4IWQgUd/tp8DmzK1dIqS41sORS9P4sZJa/rpWVJ0PdENahz/GCrJYZZbI/V4pa
    // BUp8DK004wKBgH11OqBuPriPoYN3fbK0Owy2W7b3KEUVOcGK5lwTbgdW7gNE+vHf
    // yA2khj8H5Dt9AVrUcUGaaQDOwcHHm8bNEV44lJeRbN2fSKF/X9REH1FebeOrSbvK
    // uKpYR1sKwn2h8CRUQJWAMLADfbSAN11gKhwik5KOW02HAhw97mEiBQdnAoGAFzxR
    // vdIXMTtFehkor7MB9sKB1q8ONgjc9QHL4208JwyNI2YV4D2EER6Qc48tnh/1Ht1a
    // vZ/rf0zAComgwtvSVVpWsZzc0g9Y94sBAAOu51DPMnrwBAawVo6/QKO4N926OAtB
    // oOPPJIZFrUGNvg8lqwSLOopMCoPfDUnwRkggxDsCgYEAwHnJ+PtLyyFEB4UJMA0z
    // UC02wLI2AKt2z3Nn6vJL73Cq+ESRiRA9+G+eGle1EvdXLL4G3x4Kk1rE87Au/Q/D
    // zeA1eQyi4BIY0BkQc5Xqm3FX/AK08CJZACsrN8NJ98sCiJw49m3CyXAZmay3Dnqu
    // MXV92BUD35Uv4E35zBE0fBM=
    // -----END PRIVATE KEY-----";


    public function __construct()
    {
        $this->privatekey = '-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCl8hAIz+odHVMR
W8/XpUdqwwnHj4+t8zd2RdFWkaWg29x/iuk9z9YO4IXKwTDI226rI8t39U4b2c11
j9ZkDXCjdlaPJ+/iS7v4l+zM4X9/QLjT0/QiT3rEwRvfq/F51Mp2o/ECc3Wg5i+9
ln9uBPxzoJy76vC3D2+1HQup7ZWp95TIrVPFCvtBLAIjuCR7NiNbOngQr5GTEd/q
mMLEIuzX/1kOY/ug4xY2NacxtpnkgqWcykI3lKWQ5YgA9dSNYprAp7fDS069FNAS
Nwq63kmWR2JJq0CKG0dE78YekAxhqyJX874FPbZxqqH2Ea4YYJ62VpbcWg3OQm6V
YvHbKOv1AgMBAAECggEADyu3ClpmDvoiuvm6x/5eYUTdYwO3FFihrGVez8Kjv4LG
5yR+HqsegnoSOsjSOrqc2BAYrN0ECNXIZV2cZJJtLSet0b6XI2532JbP2XDDS13r
LiprxxGfED4oDzKH8lkt/UF1nU5ZTASScfGm5E1kyvYjytlqq9tBNu+/cW4jLZUr
CsdMEY/fG6x16jf/HQMbTxTbJeRc6T6LwvOxIpDD4o+NPEbb1eYuj3s9DuFb9DhA
zk3LZ4+LcgLDTrD/EUKNeHZH/cNrE9+ONCp5JOJbKdyi2BK6Lq/aUBerXUz+qU1a
Kk7vLh31thcZ759XirdOYPfMLZ0it/qU0tArlWo3zQKBgQDnk6x9CDTT/5UUcsRL
Fkj9LTCSElKsqt/l9heoGwKm1nUCaH4VqjKN29FyiS1MK7qi3Rw2y6aWVP+fKWfA
UzyCsVIEhzWzyekXaWbdtwPLz3SKPlI0ZJnJtq8acNn7sP0J2/hBIOqJW0l3F1av
mFd6GJ0a6lUJcMIuXLpzS3iLRwKBgQC3cmoXvcmjvfaa9ULbIx2xANnjWMDX2VuP
FqIRvJJP5XvR1wXG7YlZPRSDHmnR+WCFzA3I4QpuOoNqqgc7Qs37w81r5O+nEEi/
VA4IWQgUd/tp8DmzK1dIqS41sORS9P4sZJa/rpWVJ0PdENahz/GCrJYZZbI/V4pa
BUp8DK004wKBgH11OqBuPriPoYN3fbK0Owy2W7b3KEUVOcGK5lwTbgdW7gNE+vHf
yA2khj8H5Dt9AVrUcUGaaQDOwcHHm8bNEV44lJeRbN2fSKF/X9REH1FebeOrSbvK
uKpYR1sKwn2h8CRUQJWAMLADfbSAN11gKhwik5KOW02HAhw97mEiBQdnAoGAFzxR
vdIXMTtFehkor7MB9sKB1q8ONgjc9QHL4208JwyNI2YV4D2EER6Qc48tnh/1Ht1a
vZ/rf0zAComgwtvSVVpWsZzc0g9Y94sBAAOu51DPMnrwBAawVo6/QKO4N926OAtB
oOPPJIZFrUGNvg8lqwSLOopMCoPfDUnwRkggxDsCgYEAwHnJ+PtLyyFEB4UJMA0z
UC02wLI2AKt2z3Nn6vJL73Cq+ESRiRA9+G+eGle1EvdXLL4G3x4Kk1rE87Au/Q/D
zeA1eQyi4BIY0BkQc5Xqm3FX/AK08CJZACsrN8NJ98sCiJw49m3CyXAZmay3Dnqu
MXV92BUD35Uv4E35zBE0fBM=
-----END PRIVATE KEY-----';

    }

    private function base64url_encode($data)
    {
      return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    //Google's Documentation of Creating a JWT: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests


    public function getAssertion(){

      //{Base64url encoded JSON header}
      $jwtHeader = $this->base64url_encode(json_encode(array(
        "alg" => "RS256",
        "typ" => "JWT"
      )));
      //{Base64url encoded JSON claim set}
      $now = time();
      $jwtClaim = $this->base64url_encode(json_encode(array(
        "iss" => "devoteeinapp@devotee-38099.iam.gserviceaccount.com",
        "scope" => "https://www.googleapis.com/auth/androidpublisher",
        "aud" => "https://oauth2.googleapis.com/token",
        // "exp" => 1649439515,
        // "iat" => 1649435915,
        "exp" => $now + 3600,
        "iat" => $now
      )));
      //The base string for the signature: {Base64url encoded JSON header}.{Base64url encoded JSON claim set}
      openssl_sign(
        $jwtHeader . "." . $jwtClaim,
        $jwtSig,
        $this->privatekey,
        "sha256WithRSAEncryption"
      );
      //    "sha256WithRSAEncryption"
      $jwtSign = $this->base64url_encode($jwtSig);

      //{Base64url encoded JSON header}.{Base64url encoded JSON claim set}.{Base64url encoded signature}
      $jwtAssertion = $jwtHeader . "." . $jwtClaim . "." . $jwtSign;

      return $jwtAssertion;   
    }

    public function generateBearer($assertion)
    {

      $curl = curl_init();

      curl_setopt_array($curl, [
        CURLOPT_URL => "https://oauth2.googleapis.com/token?grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=".$assertion,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "",
      ]);

      $response = curl_exec($curl);
      $err = curl_error($curl);

      curl_close($curl);

      if ($err) {
        echo "cURL Error #:" . $err;
      } else {
        return json_decode($response);
      }
      

      
    }

    public function googleVerify($productId, $purchaseToken, $bearer)
    {
      $curl = curl_init();

      curl_setopt_array($curl, [
        CURLOPT_URL => "https://androidpublisher.googleapis.com/androidpublisher/v3/applications/com.phurshell.devotee/purchases/subscriptions/".$productId."/tokens/".$purchaseToken,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "",
        CURLOPT_HTTPHEADER => [
          "Authorization: Bearer ".$bearer
        ],
      ]);

      $response = curl_exec($curl);
      $err = curl_error($curl);

      curl_close($curl);

      if ($err) {
        echo "cURL Error #:" . $err;
      } else {
        return json_decode($response);
      }
    }

    public function appleVerifyDev($transactionReceipt)
    {
      $curl = curl_init();

      curl_setopt_array($curl, [
        CURLOPT_URL => "https://sandbox.itunes.apple.com/verifyReceipt",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\n\t\"receipt-data\": \"".$transactionReceipt."\",\n\t\"password\": \"0be96d98236642f28ddb80fc3cc46f6e\"\n}",
        CURLOPT_HTTPHEADER => [
          "Content-Type: application/json"
        ],
      ]);

      $response = curl_exec($curl);
      $err = curl_error($curl);

      curl_close($curl);

      if ($err) {
        echo "cURL Error #:" . $err;
      } else {
        return json_decode($response);
      }

    }


    public function appleVerifyProd($transactionReceipt)
    {
      $curl = curl_init();

      curl_setopt_array($curl, [
        CURLOPT_URL => "https://buy.itunes.apple.com/verifyReceipt",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\n\t\t\t\t\"receipt-data\": \"".$transactionReceipt."\",\n\t\t\t\t\"password\": \"0be96d98236642f28ddb80fc3cc46f6e\"\n}",
        CURLOPT_HTTPHEADER => [
          "Content-Type: application/json"
        ],
      ]);

      $response = curl_exec($curl);
      $err = curl_error($curl);

      curl_close($curl);

      if ($err) {
        echo "cURL Error #:" . $err;
      } else {
        return json_decode($response);
      }

    }
   
}
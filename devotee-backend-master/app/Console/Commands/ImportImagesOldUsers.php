<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\UsersOld;
use App\Models\User;
use App\Models\ProfilePicture;
use Illuminate\Support\Facades\Storage;



class ImportImagesOldUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:images {old_id} {order}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $oldId = $this->argument('old_id');
        $order = $this->argument('order');

        $sign =  $order == 'asc' ? '>=' : '<=';


        $legacyUsers = User::where('old_id',$sign,$oldId)
        ->orderBy('old_id',$order)
        ->get();


        foreach ($legacyUsers as $u ) {


            $check = ProfilePicture::where('user_id',$u->id)->count();
            if($check) continue;

            $imagesToImport = [];

            echo $u->old_id.PHP_EOL;

            $old = $this->fetchUserOldApi($u->old_id);

            if(!isset($old->user)) continue;

            $imagesToImport[] = [
                'url' => $old->user->profile_image,
                'main' => 1,
                'order' => 0
            ];

            $order = 1;

            foreach ($old->album as $k=>$v) {
                $imagesToImport[] = [
                    'url' => $v,
                    'main' => 0,
                    'order' => $order
                ];    
                $order++;
            }

            $upload = $this->uploadImages($u->id,$imagesToImport);
            // die();

        }
    }


    private function is_404($url) {
        $handle = curl_init($url);
        curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
    
        /* Get the HTML or whatever is linked in $url. */
        $response = curl_exec($handle);
    
        /* Check for 404 (file not found). */
        $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
        curl_close($handle);
    
        /* If the document has loaded successfully without any redirection or error */
        if ($httpCode >= 200 && $httpCode < 300) {
            return false;
        } else {
            return true;
        }
    }

    public function uploadImages($user_id,$array){

        foreach ($array as $img ) {
            $url = 'http://34.223.220.245/'.$img['url'];

            $is404 = $this->is_404($url);
            if($is404) continue;

            $data = $this->file_get_contents_curl($url);

            if($data){
                $insert =  ProfilePicture::create([
                    'user_id' => $user_id,
                    'main' => $img['main'],
                    'order' => $img['order'],
                ]);  
                $ext = 'jpg';
    
               
    
    
    
                $up = $this->upload( $data, $insert->id.'_'.rand(10,99999), $ext);
    
                $insert->path =  $up;
                $insert->save();
            }
         


        }
       
     
    }


    private function file_get_contents_curl($url) {

        echo "fetching... ".$url.PHP_EOL;
        $ch = curl_init();
      
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
      
        $data = curl_exec($ch);
        curl_close($ch);
      
        return $data;
    }
      

    public function upload($file, $name, $ext)
    {

        $filename = md5($name).".".$ext;
        $docFile =  'profile_pictures/'.$filename;
        $go = Storage::disk('s3')->put($docFile , $file,'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }
    public function fetchUserOldApi($id){
        $curl = curl_init();
        curl_setopt_array($curl, [
        CURLOPT_URL => "http://34.223.220.245/api/V1//user/?user_id=".$id,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_POSTFIELDS => "",
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "X-API-KEY: guEFSkAEITO4ZmFxIN76WmdpOqcnG35BgKRgkvO5"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

         return json_decode($response);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $users = 150;

        $gender = ['male','female'];
        $sex = ['bissexual','hétero','gay'];
        $femaleNames = ['Amanda','Fernanda','Carla','Fotocópia','Rafaela','Juliana','Carolina','Ana','Abigail','Valentina'];
        $maleNames = ['Robson','Guilherme','Carlos','Marcos','André','Rodrigo','Rafael','Enzo','Carimbo'];
        $lastNames = ['Silva','Pereira','Alves','Rodrigues','Castro','Freitas','Schmidt'];

        $geo = [
            [-23.537346327717234, -46.59564663336074],
            [-23.57928286289444, -46.578899889068786],
            [-23.539645471258293, -46.454384679434305],
            [-23.61761856065462, -46.56864207191977],
            [-23.620196381457706, -46.634335022994044],
            [-23.603307948201646, -46.67283301679196]
        ];


        for ($i=0; $i < $users; $i++) { 

            $randGeo = $geo[random_int(0, count($geo)-1)];
            $userGender = $gender[random_int(0, count($gender)-1)];
            $name = Str::random(10);
            if($userGender == 'male') $name = $maleNames[random_int(0, count($maleNames)-1)];
            if($userGender == 'female') $name = $femaleNames[random_int(0, count($femaleNames)-1)];
            $lastName = $lastNames[random_int(0, count($lastNames)-1)];
            $userSex = $sex[random_int(0, count($sex)-1)];



            DB::table('users')->insert([
                'name' => $name . ' ' . $lastName  ,
                'email' => Str::random(10).'@test.com',
                'password' => Hash::make('12345678'),
                'type' => 'user',
                'birthdate' => '1988-01-01',
                'gender' => $userGender,
                'show_as_gender' => $userGender,
                'sexual_orientation' => $userSex,
                'target_gender' => $gender[random_int(0, count($gender)-1)],
                'lat' => $randGeo[0],
                'lng' => $randGeo[1],
            ]);

            DB::table('profile_pictures')->insert([
                'user_id' => $i + 1 ,
                'path' => '/path/to/img.png' ,
                'main' => true ,
            ]);

        }


       
    }
}

<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project name
set('application', 'my_project');

// Project repository

set('repository', 'https://paulosergio.marinhofilho%40gmail.com:psfilho123@gitlab.com/phurshell/Devotee/devotee-backend.git');

// https://gitlab.com/phurshell/phurshell/phurshell-backend.git

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', false);

// Shared files/dirs between deploys
add('shared_files', []);
add('shared_dirs', []);

// Writable dirs by web server
add('writable_dirs', []);

// Hosts

//host('ubuntu@54.232.1.121')
//host('ubuntu@54.232.1.121')

host('ubuntu@54.207.143.191')
    //->set('deploy_path', '/var/www/html')
    ->set('deploy_path', '/var/www/backend-dev')
    //->identityFile('/Users/andrewsalves/Documents/Gerais/phurshell/pem_keys/devotee.pem');
    ->identityFile('/Users/paulo/Downloads/new-devotee.pem');


// $branch = trim(shell_exec('git rev-parse --abbrev-ref HEAD'));

// var_dump($branch);die();

// if($branch == 'master') {
//     // HOST PROD
//     host('ubuntu@54.207.143.191')
//     ->set('deploy_path', '/var/www/html')
//     ->identityFile('/Users/paulo/Downloads/new-devotee.pem');
// } else {
//     // HOST DEV
//     host('ubuntu@54.207.143.191')
//         ->set('deploy_path', '/var/www/backend-dev')
//         ->identityFile('/Users/paulo/Downloads/new-devotee.pem');
// }


task('build', function () {
    run('cd {{release_path}} && build');
});

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.

before('deploy:symlink', 'artisan:migrate');

task('deploy', [
    'deploy:unlock',
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:vendors',
    'deploy:writable',
    // 'artisan:storage:link',
    // 'artisan:view:clear',
    // 'artisan:migrate',
    // 'artisan:optimize',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
]);

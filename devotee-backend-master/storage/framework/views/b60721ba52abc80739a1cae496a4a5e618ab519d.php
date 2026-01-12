<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>">
    <!-- <script>
        window.onload = () => {
            // setTimeout(() => {
                // let btn = document.getElementById("botao")
                // btn.click()
                // console.log('clicou')
                window.location = 'devotee://google-login?data=<?=$data?>')
            // }, 2000);
        }
    </script> -->
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <? echo $data?>
        <a href="devotee://google-login?data=<? $data?>" >skhdgashdsahj</a>
        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        <!-- Styles -->
        

        <style>
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
            <a id="botao" style="margin-top: 50px; color: white" href="devotee://google-login?data=testeteseteee"> Voltar para o app </a>
        </div>

    </body>
</html>
<?php /**PATH /Applications/XAMPP/xamppfiles/htdocs/devotee-backend/resources/views/login.blade.php ENDPATH**/ ?>
<div style="text-align: center; margin: auto;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse:collapse;height:100%;margin:0;padding:0;width:100%;background-color:#f7f7f7">
        <tbody>
            <tr>
                <td align="center" valign="top" style="height:100%;margin:0;padding:40px;width:100%;font-family:Helvetica,Arial,sans-serif;line-height:160%">
                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:600px;background-color:#ffffff;border:1px solid #d9d9d9">
                        <tbody>
                            <tr>
                                <td align="center" valign="top" style="font-family:Helvetica,Arial,sans-serif;line-height:160%">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
                                        <tbody>
                                            <tr>
                                                <td align="center" style="background-color:#ffffff;font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-top:20px;padding-bottom:20px;background:#fff">
                                                    <img src="https://devotee.s3.sa-east-1.amazonaws.com/photo_2021-10-05+13.53.12.jpeg" alt="chefe" width="80" style="border:0;min-height:auto;line-height:100%;outline:none;text-decoration:none;width:140px" class="m_5160328873367492115CToWUd CToWUd">
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#ffffff;border-top:1px solid #ffffff;border-bottom:1px solid #ffffff">
                                        <tbody>
                                            <tr style="height:100px;color:#fff; background: #2E4664;">
                                                <td valign="top" style="text-align:center;font-family:Helvetica,Arial,sans-serif;line-height:100%;color:#fff;font-size:23px;font-weight:bold;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;vertical-align:middle">
                                                    <span>REDEFINIÇÃO DE SENHA</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;color:#404040;font-size:16px;padding-top:64px;padding-bottom:40px;padding-right:72px;padding-left:72px;background:#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#ffffff">
                                        <tbody>
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:32px;text-align:center">
                                                    <h2 style="display:block;font-family:Helvetica,Arial,sans-serif;font-style:normal;font-weight:bold;line-height:100%;letter-spacing:normal;margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;text-align:center;color:#404040;font-size:20px">Olá, <?php echo $name ?><strong style="color:#404040;font-weight:600"></strong>!</h2>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:32px;text-align:center">
                                                    <p style="margin:0">Identificamos que você perdeu<br> seu acesso ao <strong style="color:#404040;font-weight:600"><?php echo env('APP_NAME') ?></strong>.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:32px;text-align:center">
                                                    <p style="margin:0">Para recuperar sua senha clique no botão abaixo </p>
                                                </td>
                                            </tr>

                                            <tr>
                                              <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:32px;text-align:center;">
                                                <a href="https://password.devotee.com.br/?token=<?= $hash ?>&email=<?= $email ?>">
                                                  <button style="background-color: #2E4664; color: #FFF; border: 0px solid #2E4664; border-radius: 10px; padding:15px;">
                                                    Recuperar senha
                                                  </button>
                                                </a>
                                              </td>
                                            </tr>
                                            
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;margin-bottom:0;padding-bottom:0;text-align:center">
                                                    <p style="margin:0;margin-bottom:0;padding-bottom:0">Obrigado,<br>Equipe <?php echo env('APP_NAME') ?></p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;background:#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background-color:#ffffff">
                                        <tbody>
                                            <tr>
                                                <td width="80%" style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:16px;text-align:center">
                                                    <hr style="width:80%;border:0;border-top:1px solid #ddd">
                                                </td>
                                            </tr>
                                            <!-- <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:16px;text-align:center;padding-left:12%;padding-right:12%">
                                                    <p style="margin:0;color:#999;font-size:12px">
                                                        Em caso de qualquer dúvida, fique à vontade para responder esse email ou nos contatar no
                                                        <a href="mailto:contato@psiapp.com.br" style="color:#0E9793;font-weight:bold;text-decoration:none" target="_blank">contato@psiapp.com.br</a>.
                                                    </p>
                                                </td>
                                            </tr> -->
                                            <!-- <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:8px;text-align:center">
                                                    <a href="https://www.facebook.com/Buyapp-103416984921771" style="color:#404040;font-weight:bold;text-decoration:none" target="_blank">
                                                        <img alt="Facebook" src="https://buyapp.s3-sa-east-1.amazonaws.com/assets/facebook.png" width="32" style="border:0;min-height:auto;line-height:100%;outline:none;text-decoration:none" class="m_5160328873367492115CToWUd CToWUd">
                                                    </a>
                                                    
                                                    
                                                    <a href="https://www.instagram.com/buyappbrasil" style="color:#404040;font-weight:bold;text-decoration:none" target="_blank">
                                                        <img alt="Instagram" src="https://buyapp.s3-sa-east-1.amazonaws.com/assets/instagram.png" width="32" style="border:0;min-height:auto;line-height:100%;outline:none;text-decoration:none" class="m_5160328873367492115CToWUd CToWUd">
                                                    </a>
                                                </td>
                                            </tr> -->
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:16px;text-align:center">
                                                    <hr style="margin-right:auto;margin-left:auto;width:30px;border:0;border-top:1px solid #ddd">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-family:Helvetica,Arial,sans-serif;line-height:160%;padding-bottom:40px;text-align:center">
                                                    <p style="margin:0;color:#999;font-size:12px"><?php echo env('APP_NAME') ?></p>
                                                    <span style="color:#ffffff;font-size:0;min-height:0"></span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>
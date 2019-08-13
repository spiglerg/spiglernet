<?php
  if (isset($_POST['sent'])) {
    $to = "stefano.spigler@u-psud.fr";
    $subject = "[Email from spigler.net/stefano]";
    $txt = "[FROM: ".$_POST['email']."] ".$_POST['msg'];
    $headers = "From: admin@spigler.net";
#    mail($to,$subject,$txt,$headers);
  }
?>

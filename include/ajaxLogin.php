<?php
/**
 * Login by AJAX
 * 
 * @author muhurta
 */

include "UserClass.php";

$name = htmlspecialchars($_POST["username"]);
$pass = htmlspecialchars($_POST["password"]);

$curUser = new User;
$ret = false;
if ($curUser->login($name, $pass)) {
    $ret = true;
}

echo json_encode(array(
        "result"=>$ret,
        "info"=>$curUser->getUserinfo
    ));


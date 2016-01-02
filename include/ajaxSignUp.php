<?php
/**
 * Sign up by AJAX
 * 
 * @author xuyuwei
 */

include "UserClass.php";

$name = htmlspecialchars($_POST["username"]);
$pass = htmlspecialchars($_POST["password"]);
$email = htmlspecialchars($_POST["email"]);
$info = htmlspecialchars($_POST["info"]);
$gender = htmlspecialchars($_POST["gender"]);
if ($gender == NULL) $gender=NULL;

$ret = false;
$curUser = new User;

if (User::newuser($name,$pass,$email,$info,$gender)) {
    $ret = true;
    $curUser->login($name,$pass);
}

echo json_encode(array(
        "result" => $ret,
        "info" => $curUser->getUserinfo(),
		"error" => User::$error
    ));


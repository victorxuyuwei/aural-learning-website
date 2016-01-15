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
$gender = htmlspecialchars($_POST["gender"]);
$info = htmlspecialchars($_POST["info"]);
$avatar = htmlspecialchars($_POST["avatar"]);

$ret = false;
$curUser = new User;

if (User::newuser($name,$pass,$email,$gender,$info,$avatar)) {
    $ret = true;
    $curUser->login($name,$pass);
}

echo json_encode(array(
        "result" => $ret,
        "info" => $curUser->getUserinfo(),
		"error" => User::$error
    ));


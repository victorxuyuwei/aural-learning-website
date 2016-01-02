<?php
include "UserClass.php";


if (!User::newuser("debug","123456","a@b.c","")) {
	echo User::$error;
}

$curUser = new User;
$curUser->login("debug","123456");
echo json_encode($curUser->getUserinfo()) . "\n";

$curUser->logout();
echo json_encode($curUser->getUserinfo());

//User::listallusers();
// $curUser = new User;

// if ($curUser->login("root", "123456")) {
// 	echo json_encode($curUser->getUserinfo());
// }
// else {
// 	echo "something wrong";
// }

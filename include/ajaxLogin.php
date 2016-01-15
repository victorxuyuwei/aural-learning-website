<?php
/**
 * Login by AJAX
 * 
 * @author muhurta
 */

include "UserClass.php";
$curUser = new User;
$ret = false;

// $_POST["username"] = "debug";
// $_POST["password"] = "123456";
if (isset($_GET["logout"])) {
    $curUser->logout();
    $ret = true;
}
else if(isset($_GET["login"])) {
    $name = htmlspecialchars($_POST["username"]);
    $pass = htmlspecialchars($_POST["password"]);

    if ($curUser->login($name, $pass)) {
        $ret = true;
    }
}
else {
	if (isset($_SESSION["uid"]))
		$ret = true;
}

echo json_encode(array(
        "result"=>$ret,
        "info"=>$curUser->getUserinfo()
    ));


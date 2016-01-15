<?php

session_start();

include "DataBaseClass.php";

/**
 * User class 
 * 
 * @author muhurta
 */
class User {
    private $name;
    private $info;
    private $level;
    
    public static $errno = 0;
    public static $error = "";
    
    
    public function getUsername() {
        return $this->name;
    }
    public function getUserinfo() {
        return $this->info;
    }
    
//     public function __construct() {
//     	$this->init();
//     }
    
    public function __construct() {
        $this->name = "visiter";
        $this->info = array();
        if (isset($_SESSION["uid"])) {
            global $db;
            $uid = $db->escape_string($_SESSION["uid"]);
            $sql = "SELECT `uid`,`name`,`email`,`gender`,`info`,`avatar` FROM `users` WHERE `uid`='$uid'";
			$result = $db->query($sql);
            if (!$result || $result->num_rows != 1) {
                self::$errno = $db->errno;
                self::$error = $db->error;
                return;
            }
            $this->info = $result->fetch_assoc();
            $this->name = $this->info["name"];
        }
    }
    public function login($name, $pass) {
        global $db;
        $name = $db->escape_string($name);
        $pass = $db->escape_string(sha1($pass));
        $sql = "SELECT `uid`,`name`,`email`,`gender`,`info`,`avatar` FROM `users` WHERE `name`='$name' AND `pass`='$pass'";
    
        $result = $db->query($sql);
        if (!$result || $result->num_rows != 1) {
            self::$errno = $db->errno;
            self::$error = $db->error;
            $this->logout();
            return false;
        }
        $this->info = $result->fetch_assoc();
        $this->name = $this->info["name"];
        
        $_SESSION["uid"] = $this->info["uid"];
        return true;
    }
    public function logout() {
        session_destroy();
        unset($_SESSION);
        $this->__construct();
    }
    
    /**
     * Create a new user
     * 
     * @param string $name 用户名
     * @param string $pass 密码
     * @param string $email
     * @param string $info 个人说明
     * @param integer $gender [optional] 性别 可为空
     * 
     * @return bool
     */
    public static function newuser($name, $pass, $email, $gender, $info="", $avatar="") {
        global $db;
        
        //typecheck here
        //safe check here
        if (strlen($pass) < 6) {
            self::$error = "illegal password";
            return false;
        }
        $name = $db->escape_string($name);
        $pass = $db->escape_string(sha1($pass));
        $email = $db->escape_string($email);
        $info = $db->escape_string($info);
        $gender = $db->escape_string($gender);
        $avatar = $db->escape_string($avatar);

        if ($name == "") {
            self::$error = "illegal username";
            return false;
        }
        if ($email == "") {
            self::$error = "illegal email";
            return false;
        }
        if ($gender == "") {
            self::$error = "illegal gender";
            return false;
        }


        $sql = "SELECT `uid` FROM `users` WHERE `name`='$name'";
        $result = $db->query($sql);
        if ($result->num_rows > 0) {
        	self::$error = "username have existed";
        	return false;
        }
        
        $result->free();
        $sql = "INSERT INTO `users`(`name`, `pass`, `email`, `gender`, `info`,`avatar`) " .
                            "VALUES ('$name', '$pass', '$email', '$gender', '$info', '$avatar')";
        
        $result = $db->query($sql);
        if (!$result) {
            self::$errno = $db->errno;
            self::$error = $db->error;
            return false;
        }
        return true;
    }
    
    public static function listallusers() {
        global $db;
        $result = $db->query("SELECT * FROM `users`");
        while ($row = $result->fetch_assoc())
            echo json_encode($row) . "\n";
    }
}



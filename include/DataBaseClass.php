<?php
include '../config.php';



$db = new mysqli(
			$config['db']['host'],
			$config['db']['username'],
			$config['db']['password'],
			$config['db']['database']
		);


if ($db->connect_error) {
    die('Connect Error (' . $db->connect_errno . ') '
            . $db->connect_error);
}

// $a = "sdf --";
// echo $db->real_escape_string($a) . "\n";
// echo $a;

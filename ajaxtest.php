<?php

$a["test"] = "success";

echo json_encode(array(
    "test"=>"success",
    "get"=>$_GET,
    "post"=>$_POST
));

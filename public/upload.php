<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

ini_set('display_errors', E_ALL);

header('Content-Type: application/json; charset=utf-8');

$uploads_dir = "uploads";

if (!empty($_FILES["arquivo"]) && $_FILES["arquivo"]["error"] == UPLOAD_ERR_OK) {
  $tmp_name = $_FILES["arquivo"]["tmp_name"];
  $path_parts = pathinfo(basename($_FILES["arquivo"]["name"]));

  $new_name = time() .".". $path_parts['extension'];
  move_uploaded_file($tmp_name, "$uploads_dir/$new_name");

  echo json_encode($new_name);
} else {
  echo json_encode(false);
}

exit();
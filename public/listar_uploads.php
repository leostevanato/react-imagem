<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

$dir = 'uploads';

$arquivos = array_diff(scandir($dir), array('..', '.', '.htaccess'));
$arquivos = array_values($arquivos);

rsort($arquivos);

echo json_encode($arquivos);

exit();
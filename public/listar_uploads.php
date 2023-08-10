<?php
$dir = 'uploads';

$arquivos = array_diff(scandir($dir), array('..', '.'));

echo "<pre>";
// print_r($arquivos);
echo json_encode($arquivos);
echo "</pre>";
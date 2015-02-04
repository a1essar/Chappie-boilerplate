<?php

$config = file_get_contents("../client/json/config.json");
$config = json_decode($config, true);
var_dump($config);
$config['change-config-from-php'] = true;
file_put_contents("../client/json/config.json", json_encode($config, JSON_PRETTY_PRINT));
?>
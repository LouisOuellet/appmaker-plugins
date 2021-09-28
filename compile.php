<?php
$settings=json_decode(file_get_contents(dirname(__FILE__) . '/dist/data/manifest.json'),true);
$settings['build'] = $settings['build']+1;
$settings['version'] = date("y.m").'-'.$settings['repository']['branch'];
$json = fopen(dirname(__FILE__) . '/dist/data/manifest.json', 'w');
fwrite($json, json_encode($settings, JSON_PRETTY_PRINT));
fclose($json);
shell_exec("git add . && git commit -m 'UPDATE' && git push origin ".$settings['repository']['branch']);
echo "\n";
echo "Version: ".$settings['version']."\n";
echo "Build: ".$settings['build']."\n";
echo "\n";
echo "Published on ".$settings['repository']['host']['git'].$settings['repository']['name'].".git\n";

<?php
if(!is_dir(dirname(__FILE__) . '/dist')){ mkdir(dirname(__FILE__) . '/dist'); }
if(!is_dir(dirname(__FILE__) . '/dist/data')){ mkdir(dirname(__FILE__) . '/dist/data'); }
if(is_file(dirname(__FILE__) . '/dist/data/manifest.json')){
  $settings=json_decode(file_get_contents(dirname(__FILE__) . '/dist/data/manifest.json'),true);
  $settings['build'] = $settings['build']+1;
  $settings['version'] = date("y.m").'-'.$settings['repository']['branch'];
  $manifest = fopen(dirname(__FILE__) . '/dist/data/manifest.json', 'w');
  fwrite($manifest, json_encode($settings, JSON_PRETTY_PRINT));
  fclose($manifest);
} else {
  $settings['repository']['name'] = shell_exec("basename `git rev-parse --show-toplevel`");
  $settings['repository']['branch'] = shell_exec("git rev-parse --abbrev-ref HEAD");
  $settings['repository']['manifest'] = dirname(__FILE__) . '/dist/data/manifest.json';
  $settings['repository']['host']['git'] = shell_exec("git config --get remote.origin.url");
  $settings['status'] = false;
  $settings['build'] = 1;
  $settings['version'] = date("y.m").'-'.$settings['repository']['branch'];
  $manifest = fopen(dirname(__FILE__) . '/dist/data/manifest.json', 'w');
  fwrite($manifest, json_encode($settings, JSON_PRETTY_PRINT));
  fclose($manifest);
}
shell_exec("git add . && git commit -m 'UPDATE' && git push origin ".$settings['repository']['branch']);
echo "\n";
echo "Version: ".$settings['version']."\n";
echo "Build: ".$settings['build']."\n";
echo "\n";
echo "Published on ".$settings['repository']['host']['git'].$settings['repository']['name'].".git\n";

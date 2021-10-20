<?php
$contents = file_get_contents(dirname(__FILE__) . '/.gitignore');
var_dump($contents);
var_dump(explode("\n",$contents));

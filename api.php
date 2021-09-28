<?php
class pluginsAPI extends API {
	public function status($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      $this->Settings['plugins'][$data['plugin']] = $data['state'];
      $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
    }
  }
}

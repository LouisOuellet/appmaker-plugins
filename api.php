<?php
class pluginsAPI extends API {

  public function get($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      return [
        "success" => $this->Language->Field["This request was successfull"],
        "request" => $request,
        "data" => $data,
				"output" => [
					'plugins' => $this->Plugins,
					'settings' => $this->Settings['plugins'],
				],
      ];
    }
  }

	public function status($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      $this->Settings['plugins'][$data['plugin']]['status'] = $data['state'];
      $this->SaveCfg(['plugins' => $this->Settings['plugins']]);
      if($data['state']){
        return [
          "success" => $this->Language->Field["Plugin was activated"],
          "request" => $request,
          "data" => $data,
        ];
      } else {
        return [
          "success" => $this->Language->Field["Plugin was deactivated"],
          "request" => $request,
          "data" => $data,
        ];
      }
    }
  }

	public function update($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      if(isset($data['plugin'])){
        $data['silent']=true;
        if($this->__uninstall($data)){
          $data['force']=true;
          if($this->__install($data)){
            return [
              "success" => $this->Language->Field["Plugin was updated"],
              "request" => $request,
              "data" => $data,
            ];
          } else {
            return [
              "error" => $this->Language->Field["Unable to install plugin"],
              "request" => $request,
              "data" => $data,
            ];
          }
        } else {
          return [
            "error" => $this->Language->Field["Unable to uninstall plugin"],
            "request" => $request,
            "data" => $data,
          ];
        }
      }
    }
  }

	public function install($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      if(isset($data['plugin'])){
        $data['silent']=true;
        $this->__install($data);
        return [
          "success" => $this->Language->Field["Plugin was updated"],
          "request" => $request,
          "data" => $data,
        ];
      }
    }
  }

	public function uninstall($request, $data){
		if(isset($data)){
			if(!is_array($data)){ $data = json_decode($data, true); }
      if(isset($data['plugin'])){
        $data['silent']=true;
        $this->__uninstall($data);
        return [
          "success" => $this->Language->Field["Plugin was updated"],
          "request" => $request,
          "data" => $data,
        ];
      }
    }
  }
}

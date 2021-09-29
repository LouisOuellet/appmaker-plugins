API.Plugins.plugins = {
	init:function(){
		API.GUI.Sidebar.Nav.add('Plugins', 'administration');
	},
	load:{
		index:function(){
			API.request('plugins','get',{data:{}},function(result) {
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					API.Builder.card($('#pagecontent'),{ title: 'Plugins', icon: 'plugins'}, function(card){
						var html = '', checked = '', content = card.find('.card-body');
						html += '<div class="row">';
							html += '<div class="col-6">';
								html += '<h3>'+API.Contents.Language['Plugins']+'</h3>';
							html += '</div>';
							html += '<div class="col-6">';
								html += '<div class="input-group">';
									html += '<input type="text" id="plugin_search" class="form-control">';
									html += '<div class="input-group-append"><span class="input-group-text"><i class="icon icon-search mr-1"></i>'+API.Contents.Language['Search']+'</span></div>';
								html += '</div>';
							html += '</div>';
						html += '</div>';
						html += '<div class="row">';
							for(var [plugin, status] of Object.entries(dataset.output.plugins)){
								html += '<div class="col-12 py-2">';
									html += '<div class="input-group">';
										html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-'+plugin+' mr-1"></i>'+API.Helper.ucfirst(API.Helper.clean(plugin))+'</span></div>';
										if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'version'])){
											html += '<div class="input-group-append">';
												html += '<div class="input-group-text">'+dataset.output.settings[plugin].version+'</div>';
											html += '</div>';
										}
										if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'build'])){
											html += '<div class="input-group-append">';
												html += '<div class="input-group-text">'+dataset.output.settings[plugin].build+'</div>';
											html += '</div>';
										}
										html += '<input type="text" class="form-control switch-spacer" disabled>';
										if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'status'])){
											html += '<div class="input-group-append">';
												html += '<div class="input-group-text"><i class="fas fa-puzzle-piece mr-1"></i>'+API.Contents.Language['Status']+'</div>';
											html += '</div>';
											html += '<div class="input-group-append">';
												html += '<div class="input-group-text p-1">';
													if(dataset.output.settings[plugin].status){
														html += '<input type="checkbox" data-key="'+plugin+'" name="'+plugin+'" title="'+API.Helper.ucfirst(API.Helper.clean(plugin))+'" checked>';
													} else {
														html += '<input type="checkbox" data-key="'+plugin+'" name="'+plugin+'" title="'+API.Helper.ucfirst(API.Helper.clean(plugin))+'">';
													}
												html += '</div>';
											html += '</div>';
										}
										if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'status'])){
											html += '<div class="input-group-append">';
												html += '<button type="button" data-key="'+plugin+'" data-action="uninstall" class="btn btn-danger"><i class="fas fa-trash-alt mr-1"></i>'+API.Contents.Language['Uninstall']+'</button>';
											html += '</div>';
										}
										if(!API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'status'])){
											html += '<div class="input-group-append">';
												html += '<button type="button" data-key="'+plugin+'" data-action="install" class="btn btn-success"><i class="fas fa-download mr-1"></i>'+API.Contents.Language['Install']+'</button>';
											html += '</div>';
										}
									html += '</div>';
								html += '</div>';
							}
						html += '</div>';
						content.html(html);
						for(var [plugin, conf] of Object.entries(dataset.output.plugins)){
							if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'build'])){
								$.ajax({
					        url: dataset.output.plugins[plugin].repository.host.raw+dataset.output.plugins[plugin].repository.name+'/'+dataset.output.plugins[plugin].repository.branch+dataset.output.plugins[plugin].repository.manifest,
					        success: function(data, status, extra, more){
										var manifest = JSON.parse(data);
										var html = '';
										html += '<div class="input-group-append">';
											html += '<button type="button" data-key="'+manifest.name+'" data-action="update" class="btn btn-success"><i class="fas fa-file-download mr-1"></i>'+API.Contents.Language['Update']+'</button>';
										html += '</div>';
										if(dataset.output.settings[manifest.name].build < manifest.build){
											$('[data-key='+manifest.name+'][data-action="uninstall"]').parent().before(html);
											$('[data-key='+manifest.name+'][data-action="update"]').off().click(function(){
												API.request('plugins','update',{data:{plugin:manifest.name}});
											});
										}
					        }
								})
							}
						}
						content.find('input#plugin_search').on('input',function(){
							if($(this).val() != ''){
								content.find('.col-12.py-2').hide();
								content.find('input[data-key*="'+$(this).val()+'"]').each(function(){ $(this).parents().eq(5).show(); });
							} else { content.find('.col-12.py-2').show(); }
						});
						content.find('button[data-action]').click(function(){
							switch($(this).attr('data-action')){
								case'install': API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}});break;
								case'uninstall': API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}});break;
							}
						});
						content.find('input[type="checkbox"]').each(function(){
							$(this).bootstrapSwitch({
								onSwitchChange:function(e,state){
									dataset.output.settings[$(this).attr('data-key')].status = state;
									API.request('plugins','status',{data:{plugin:$(this).attr('data-key'),state:state}});
								}
							});
							if(API.Helper.isSet(API,['Contents','Settings','plugins',$(this).attr('data-key'),'status'])){
								$(this).bootstrapSwitch('state',dataset.output.settings[$(this).attr('data-key')].status);
							} else { $(this).bootstrapSwitch('state',false); }
						});
					});
				}
			});
		},
	},
}

API.Plugins.plugins.init();

API.Plugins.plugins = {
	init:function(){
		API.GUI.Sidebar.Nav.add('Plugins', 'administration');
	},
	load:{
		index:function(){
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
					for(var [plugin, status] of Object.entries(API.Contents.Plugins)){
						html += '<div class="col-12 py-2">';
							html += '<div class="input-group">';
								html += '<div class="input-group-prepend"><span class="input-group-text"><i class="icon icon-'+plugin+' mr-1"></i>'+API.Helper.ucfirst(API.Helper.clean(plugin))+'</span></div>';
								if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'version'])){
									html += '<div class="input-group-append">';
										html += '<div class="input-group-text">'+API.Contents.Settings.plugins[plugin].version+'</div>';
									html += '</div>';
								}
								if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'build'])){
									html += '<div class="input-group-append">';
										html += '<div class="input-group-text">'+API.Contents.Settings.plugins[plugin].build+'</div>';
									html += '</div>';
								}
								html += '<input type="text" class="form-control switch-spacer" disabled>';
								if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'status'])){
									html += '<div class="input-group-append">';
										html += '<div class="input-group-text"><i class="fas fa-puzzle-piece mr-1"></i>'+API.Contents.Language['Status']+'</div>';
									html += '</div>';
									html += '<div class="input-group-append">';
										html += '<div class="input-group-text p-1">';
											if(API.Contents.Settings.plugins[plugin].status){
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
				for(var [plugin, conf] of Object.entries(API.Contents.Plugins)){
					if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'build'])){
						$.ajax({
			        url: API.Contents.Plugins[plugin].repository.host.raw+API.Contents.Plugins[plugin].repository.name+'/'+API.Contents.Plugins[plugin].repository.branch+API.Contents.Plugins[plugin].repository.manifest,
			        success: function(data, extra){
								var manifest = JSON.parse(data);
								var html = '';
								html += '<div class="input-group-append">';
									html += '<button type="button" data-key="'+plugin+'" data-action="update" class="btn btn-success"><i class="fas fa-file-download mr-1"></i>'+API.Contents.Language['Update']+'</button>';
								html += '</div>';
								console.log(manifest);
								console.log(extra);
								// $('[data-key='+plugin+'][data-action="uninstall"]').parent().before(html);
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
						case'compile': API.request($(this).attr('data-key'),'plugin'+API.Helper.ucfirst($(this).attr('data-action')),{data:{type:'skeleton'}});break;
						default: API.request($(this).attr('data-key'),'plugin'+API.Helper.ucfirst($(this).attr('data-action')));break;
					}
				});
				content.find('input[type="checkbox"]').each(function(){
					$(this).bootstrapSwitch({
						onSwitchChange:function(e,state){
							API.Contents.Settings.plugins[$(this).attr('data-key')].status = state;
							API.request('plugins','status',{data:{plugin:$(this).attr('data-key'),state:state}});
						}
					});
					if(API.Helper.isSet(API,['Contents','Settings','plugins',$(this).attr('data-key'),'status'])){
						$(this).bootstrapSwitch('state',API.Contents.Settings.plugins[$(this).attr('data-key')].status);
					} else { $(this).bootstrapSwitch('state',false); }
				});
			});
		},
	},
}

API.Plugins.plugins.init();

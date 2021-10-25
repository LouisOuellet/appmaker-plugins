API.Plugins.plugins = {
	init:function(){
		API.GUI.Sidebar.Nav.add('Plugins', 'administration');
	},
	load:{
		index:function(){
			API.request('plugins','get',{data:{}},function(result) {
				var dataset = JSON.parse(result);
				if(dataset.success != undefined){
					API.Contents.Plugins = dataset.output.plugins;
					API.Contents.Settings.plugins = dataset.output.settings;
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
									html += '<div class="input-group-append"><button class="btn btn-success" data-action="updateAll"><i class="fas fa-file-download mr-1"></i>'+API.Contents.Language['Update All']+'</button></div>';
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
										html += '<div class="input-group-append" data-key="'+plugin+'" data-status="">';
											html += '<div class="input-group-text"><i class="fas fa-puzzle-piece mr-1"></i>'+API.Contents.Language['Status']+'</div>';
										html += '</div>';
										html += '<div class="input-group-append" data-key="'+plugin+'" data-toggle-status="">';
											html += '<div class="input-group-text p-1">';
												html += '<input type="checkbox" data-key="'+plugin+'" name="'+plugin+'" title="'+API.Helper.ucfirst(API.Helper.clean(plugin))+'">';
											html += '</div>';
										html += '</div>';
										html += '<div class="input-group-append">';
											html += '<button type="button" data-key="'+plugin+'" data-action="update" class="btn btn-success" style="display:none;"><i class="fas fa-file-download mr-1"></i>'+API.Contents.Language['Update']+'</button>';
											html += '<button type="button" data-key="'+plugin+'" data-action="uninstall" class="btn btn-danger" style="display:none;"><i class="fas fa-trash-alt mr-1"></i>'+API.Contents.Language['Uninstall']+'</button>';
											html += '<button type="button" data-key="'+plugin+'" data-action="install" class="btn btn-success" style="display:none;"><i class="fas fa-download mr-1"></i>'+API.Contents.Language['Install']+'</button>';
										html += '</div>';
									html += '</div>';
								html += '</div>';
							}
						html += '</div>';
						content.html(html);
						for(var [plugin, conf] of Object.entries(dataset.output.plugins)){
							$.ajax({
				        url: dataset.output.plugins[plugin].repository.host.raw+dataset.output.plugins[plugin].repository.name+'/'+API.Contents.Settings.repository.branch+dataset.output.plugins[plugin].repository.manifest,
				        success: function(data){
									thisplugin = this.url.substring(this.url.indexOf("appmaker-") + 9).split('/')[0];
									var manifest = JSON.parse(data);
									if(API.Helper.isSet(API,['Contents','Settings','plugins',thisplugin])){
										$('[data-key='+thisplugin+'][data-action="install"]').hide();
										$('[data-key='+thisplugin+'][data-action="uninstall"]').show();
										$('[data-key='+thisplugin+'][data-status]').show();
										$('[data-key='+thisplugin+'][data-toggle-status]').show();
										if(API.Helper.isSet(API,['Contents','Settings','plugins',thisplugin,'status'])){
											$('input[type="checkbox"][data-key="'+thisplugin+'"]').prop( "checked",dataset.output.settings[thisplugin].status);
											$('input[type="checkbox"][data-key="'+thisplugin+'"]').bootstrapSwitch('state',dataset.output.settings[thisplugin].status);
										} else { $('input[type="checkbox"][data-key="'+thisplugin+'"]').bootstrapSwitch('state',false); }
										if(!API.Helper.isSet(dataset.output.settings,[thisplugin,'build'])||dataset.output.settings[thisplugin].build < manifest.build){
											$('[data-key='+thisplugin+'][data-action="update"]').show();
										}
									}
									else {
										$('[data-key='+thisplugin+'][data-action="install"]').show();
										$('[data-key='+thisplugin+'][data-action="uninstall"]').hide();
										$('[data-key='+thisplugin+'][data-status]').hide();
										$('[data-key='+thisplugin+'][data-toggle-status]').hide();
										$('[data-key='+thisplugin+'][data-action="update"]').hide();
									}
				        },
								error: function(){
									thisplugin = this.url.substring(this.url.indexOf("appmaker-") + 9).split('/')[0];
									$('[data-key='+thisplugin+'][data-action="install"]').hide();
									$('[data-key='+thisplugin+'][data-action="uninstall"]').hide();
									$('[data-key='+thisplugin+'][data-status]').hide();
									$('[data-key='+thisplugin+'][data-toggle-status]').hide();
									$('[data-key='+thisplugin+'][data-action="update"]').hide();
								}
							});
						}
						content.find('input#plugin_search').on('input',function(){
							if($(this).val() != ''){
								content.find('.col-12.py-2').hide();
								content.find('input[data-key*="'+$(this).val()+'"]').each(function(){ $(this).parents().eq(5).show(); });
							} else { content.find('.col-12.py-2').show(); }
						});
						content.find('button[data-action]').off().click(function(){
							switch($(this).attr('data-action')){
								case'install':
									API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}},function(result){
										json = JSON.parse(result);
										if(json.success != undefined){
											if(API.Helper.isSet(dataset,['output','settings',json.data.plugin,'status'])&&dataset.output.settings[json.data.plugin].status){
												API.Plugins.plugins.Events.enable(plugin);
											}
											$('[data-key='+json.data.plugin+'][data-action="install"]').hide();
											$('[data-key='+json.data.plugin+'][data-action="uninstall"]').show();
											$('[data-key='+json.data.plugin+'][data-status]').show();
											$('[data-key='+json.data.plugin+'][data-toggle-status]').show();
										}
									});
									break;
								case'uninstall':
									API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}},function(result){
										json = JSON.parse(result);
										if(json.success != undefined){
											API.Plugins.plugins.Events.disable(plugin);
											$('[data-key='+json.data.plugin+'][data-action="install"]').show();
											$('[data-key='+json.data.plugin+'][data-action="uninstall"]').hide();
											$('[data-key='+json.data.plugin+'][data-status]').hide();
											$('[data-key='+json.data.plugin+'][data-toggle-status]').hide();
											$('[data-key='+json.data.plugin+'][data-action="update"]').hide();
										}
									});
									break;
								case'update':
									API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}},function(result){
										json = JSON.parse(result);
										if(json.success != undefined){
											API.Plugins.plugins.Events.disable(plugin);
											API.Plugins.plugins.Events.enable(plugin);
											if(API.Helper.isSet(API.Plugins,[plugin,'update'])&&(typeof API.Plugins[plugin].update === 'function')){ API.Plugins[plugin].update(); }
											$('[data-key='+json.data.plugin+'][data-action="update"]').hide();
										}
									});
									break;
								case'updateAll':
									$('button[data-action="update"]:visible').each(function(){
										API.request('plugins',$(this).attr('data-action'),{data:{plugin:$(this).attr('data-key')}},function(result){
											json = JSON.parse(result);
											if(json.success != undefined){
												API.Plugins.plugins.Events.disable(plugin);
												API.Plugins.plugins.Events.enable(plugin);
												if(API.Helper.isSet(API.Plugins,[plugin,'update'])&&(typeof API.Plugins[plugin].update === 'function')){ API.Plugins[plugin].update(); }
												$('[data-key='+json.data.plugin+'][data-action="update"]').hide();
											}
										});
									});
									break;
							}
						});
						content.find('input[type="checkbox"]').each(function(){
							plugin = $(this).attr('data-key');
							if(API.Helper.isSet(API,['Contents','Settings','plugins',plugin,'status'])){
								$('input[type="checkbox"][data-key="'+plugin+'"]').prop( "checked",dataset.output.settings[plugin].status);
								$(this).bootstrapSwitch({
									state:dataset.output.settings[plugin].status,
									onSwitchChange:function(e,state){
										plugin = $(this).attr('data-key');
										API.request('plugins','status',{data:{plugin:plugin,state:state}},function(){
											if(state){ API.Plugins.plugins.Events.enable(plugin); }
											else { API.Plugins.plugins.Events.disable(plugin); }
										});
									}
								});
							} else {
								$(this).bootstrapSwitch({
									state:false,
									onSwitchChange:function(e,state){
										plugin = $(this).attr('data-key');
										API.request('plugins','status',{data:{plugin:plugin,state:state}},function(){
											if(state){ API.Plugins.plugins.Events.enable(plugin); }
											else { API.Plugins.plugins.Events.disable(plugin); }
										});
									}
								});
							}
						});
					});
				}
			});
		},
	},
	Events:{
		enable:function(plugin){
			API.request('api','getLanguage',{ toast: false, pace: false, required: true, }).then(function(result){
				var language = JSON.parse(result);
				if(typeof language.error === 'undefined'){ API.Contents.Language = language.Lists.Language; }
				$('<link>').appendTo('head').attr({
					type: 'text/css',
					rel: 'stylesheet',
					href: '/plugins/'+plugin+'/dist/css/styles.css'
				});
				$.getScript('/plugins/'+plugin+'/dist/js/script.js');
			});
		},
		disable:function(plugin){
			API.request('api','getLanguage',{ toast: false, pace: false, required: true, }).then(function(result){
				var language = JSON.parse(result);
				if(typeof language.error === 'undefined'){ API.Contents.Language = language.Lists.Language; }
				if(API.Helper.isSet(API.Plugins,[plugin,'unload'])&&(typeof API.Plugins[plugin].unload === 'function')){ API.Plugins[plugin].unload(); }
				$('a[href^="?p='+plugin+'"]').remove();
				$('link[href="/plugins/'+plugin+'/dist/css/styles.css"]').remove();
				delete API.Plugins[plugin];
			});
		},
	},
}

API.Plugins.plugins.init();

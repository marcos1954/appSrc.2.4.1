/**
 *
 */
Ext.define('GayGuideApp.view.tablet.Settings', {
	extend: 'Ext.form.FormPanel',
	requires: [
		'Ext.field.Toggle',
		'Ext.field.Radio',
		'Ux.locale.Manager',
		'Ext.form.FieldSet',
		'Ext.TitleBar'
	],
	xtype:  'settingstablet',

	config: {
		id:         'settingsCard',
		scrollable: 'vertical',
		xtype:      'form',

		items: [{
			docked:       'top',
			xtype:        'statusbar'
		},{
			xtype:        'titlebar',
			docked:       'top',
			cls:          'sliderToolbar',
			locales:      { title : 'settings.title' },
			items: [{
				xtype:    'button',
				iconCls:  'list',
				ui:       'plain',
				name:     'slidebutton',
				listeners: {
					tap: function(me) {
						var 	x = me.up('slidenavigationview');

						Ext.callback(x.toggleContainer,x,[],0);
					}
				}
			}]

		},{
			id:           'textsize',
			xtype:        'fieldset',
			enableLocale: true,
			locales:      { title : 'settings.textsize.title' },
			
			defaults: {
				width:       '100%',
				labelWidth:  '80%'
			},
			
			items: [{
				id:           'textsizeslider',
				xtype:        'sliderfield',
				labelWidth:   '60%',
				increment:    1,
				cls:         'noSliderToolbar textsizeslider',
				//style:       'minHeight: 4.2em; padding-top:1em;',
				enableLocale: true,
				locales:      { label : 'settings.textsize.fieldlabel' },
				
				listeners: {
					initialize: function(me) {
						var x = GayGuideApp.txtSzBase;
						
						me.setMaxValue(x+3);
						me.setMinValue(x-3);
						me.setValue(GayGuideApp.txtSz || x);
					},
					change: function(me, sl, thumb, newValue, oldValue) {
						
						changemysize(newValue+"px");
						
						GayGuideApp.txtSz = newValue;
						createCookie('txtSz', newValue, 0, 300);
					},
					painted: function() {
						if (GayGuideApp.txtSz) this.setValue(parseInt(GayGuideApp.txtSz));
					}
				}
			}]
			
		},{
			id:           'gpsfieldset',
			xtype:        'fieldset',
			enableLocale: true,
			locales:      { title : 'settings.gps.title' },

			defaults: {
				width:       '100%',
				labelWidth:  '80%'
			},

			items: [{
				id:           'gpsEnabled',
				xtype:        'togglefield',
				enableLocale: true,
				locales:      { label : 'settings.gps.enable' },

				listeners: {
					painted: function(me, opts){
						var	app = GayGuideApp,
							ggv = app.ggv;

						app.cards.viewport.query('#'+me.getId())[0].setValue(ggv.gps != 'off');
					},
					change: function (me, value) {
						var	app = GayGuideApp,
							ggv = app.ggv;

						ggv.gps = me.getValue()?'home':'off';
						createCookie('gps', ggv.gps, 0, 300);

						if (me.getValue())	{
							ggv.geo.setAutoUpdate(true);

							var v = GayGuideApp.cards.MarkerMap;

							if (v && !GayGuideApp.ggv.GeoMarker) {
								GayGuideApp.ggv.myMarker = new GeolocationMarker(v.getMap());
							}
						}
						else {
							ggv.geo.setAutoUpdate(false);
							try { GayGuideApp.ggv.GeoMarker.setMap(null); } catch(err) {};
							try { GayGuideApp.ggv.myMarker.setMap(null); } catch(err) {};
						}
						if (google && me.getValue() && !ggv.gpsPosition) {
							ggv.doGeoUpdate(function(geo){});
						}
					}
				}
			},{
				id:           'directionsEnabled',
				xtype:        'togglefield',
				enableLocale: true,
				locales:      { label: 'settings.gps.directions' },

				listeners: {
					painted: function(me, opts){
						var	app = GayGuideApp,
							ggv = app.ggv;

						app.cards.viewport.query('#'+me.getId())[0].setValue(ggv.directions != 'off');
					},
					change: function (me, value) {
						var	app = GayGuideApp,
							ggv = app.ggv;

						if (ggv.directionsDisplay) ggv.directionsDisplay.setMap(null);
						ggv.directions = me.getValue() ? 'on':'off';
						createCookie('directions', ggv.directions, 0, 300);
					}
				}
			}]
		},{
			xtype:          'fieldset',
			id:             'notesfieldset',
			title:          'My Notes',
			enableLocale: 	true,
			locales: 	{ title: 'settings.notes.title' },

			defaults: 	{
				name:         'notes',
				width:        '100%',
				labelWidth:   '80%',
				enableLocale: true
			},

			items: [{
				xtype:    'togglefield',
				id:       'notesToggleField',
				locales:  { label : 'settings.notes.fieldlabel' },
				label: 'display notes in listings',
				listeners: {
					initialize: function(me) {
						me.setValue(GayGuideApp.ggv.notes=='on');
					},
					change: function(me, newvalue, oldvalue, eOpts) {
						GayGuideApp.ggv.notes = me.getValue()?'on':'off';
						createCookie('notes', GayGuideApp.ggv.notes, 0, 300);
					}
				}
			}]
		},{
			xtype:          'fieldset',
			id:             'langfieldset',
			enableLocale:   true,
			locales:        { title: 'settings.lang.title' },

			defaults: {
				name:         'lang',
				width:        '100%',
				labelWidth:   '80%',
				minHeight:    '45px',
				xtype:        'radiofield',
				checked:      false,
				enableLocale: true,
				listeners: {
					check: function (a) {
						var	newlang, oldlang = GayGuideApp.lang;

						if (a.id == 'englishCheck') newlang = 'en';
						if (a.id == 'espanolCheck') newlang = 'es';
						if (a.id == 'frenchCheck')  newlang = 'fr';

						if (oldlang == newlang) return;
						
						Ext.Msg.show({
							title:  "Gay Guide Vallarta",
							message: trans("ChangeLangQuestion"),
							width: 300,
							buttons: [
							   {enableLocale: true, locales: { text: 'buttons.no' },  itemId: 'no'},
							   {enableLocale: true, locales: { text: 'buttons.yes' }, itemId: 'yes', ui: 'action'}
						    ],
							fn: function(b, v, o) {
								var 	x = Ext.Viewport.query('#langfieldset')[0];
	
								if (b == 'yes') {
									if (oldlang != newlang) {
										GayGuideApp.lang = newlang;
										createCookie('t_lang', GayGuideApp.lang, 0, 300);
										GayGuideApp.langtext = loadLanguages(GayGuideApp.lang);
										Ux.locale.Manager.updateLocale(GayGuideApp.lang, function() {
											var 	mgr = Ux.locale.Manager,
												months = [];
	
											for (i=1; i<=12; i++)  {
												months.push(mgr.get("months."+i))
											}
											Ext.Date.monthNames = months;
											GayGuideApp.app.getApplication().getController('MainController').reloadDataStores(GayGuideApp.lang);
										});
									}
									return;
								}
	
								if (GayGuideApp.lang == 'en') {
									x.getComponent(0).check();
								}
								else if (GayGuideApp.lang == 'es') {
									x.getComponent(1).check();
								}
								else if (GayGuideApp.lang == 'fr') {
									x.getComponent(2).check();
								}
							}
						});
					}
				}
			},

			items: [{
				id:       'englishCheck',
				locales:  { label : 'settings.lang.english' },
				checked:  false
			},{
				id:       'espanolCheck',
				locales:  { label : 'settings.lang.spanish' },
				checked:  false
			},{
				id:       'frenchCheck',
				locales:  { label : 'settings.lang.french' },
				checked:  false
			}],

			listeners: {
				initialize: function(me) {
					var	lang = Ux.locale.Manager.getLanguage();

					if (lang == 'en') {
							me.getComponent(0).check();
					}
					else if (lang == 'es') {
							me.getComponent(1).check();
					}
					else if (lang == 'fr') {
							me.getComponent(2).check();
					}
				}
			}
		},{
			xtype:  'component',
            styleHtmlContent: true,
            width:  '100%',
            cls:    'ggv-author',
            html:   '<div class="ggv-author-inner"><center>App by Mark Alan Page of Vallarta APP Forge'+
                    '<br />GayGuideApp &copy; 2011-2015 Gay Guide Vallarta, All Rights Reserved.<br /> '+
                    ggv_vsnDate()+
                    '</center></div>'
		}],

		listeners: {
			painted: function() {
				GayGuideApp.ggv.clearStatusBar();
				reportView('/touch/settings');
			}
		}
	}
});

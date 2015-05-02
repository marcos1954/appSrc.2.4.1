/**
 *
 */
Ext.define("GayGuideApp.view.CuisineMenu", {
	extend: "Ext.Panel",

	alias: 'widget.cuisinemenu',
	xtype: 'cuisinemenu',

	config: {
		floating:      true,
		hidden:        true,
		centered:      true,
		modal:         true,
		hideOnMaskTap: false,
		fullscreen:    false,
		layout:        'fit',
		width:         '90%',
		height:        '70%',
		showAnimation: 'pop',
		hideAnimation: 'popOut',

		items: [{
			docked:          'top',
			xtype:           'titlebar',
			enableLocale:    true,
			locales:         { title : 'cuisine.title' },
			title:           'Choose Cuisines to Show',
			ui:              'dark',

			items: [{
				align:   'left',
				locales: { text : 'buttons.cancel' },
				ui:      'normal',
				itemId:  'cancel'
			},{
				align:   'right',
				locales: { text : 'buttons.done' },
				ui:      'confirm',
				itemId:  'done'
			}]
		},{
			xtype: 'formpanel',
			layout: 'vbox',
			//trackResetOnLoad: true,
			scrollable: {
				direction:     'vertical',
				directionLock: true
			},
			items: [{
				xtype: 'spacer'
			},{
				xtype: 'container',
				id:    'cuisineMenuControls',
				style: 'padding-top: 20px;',
				layout: {
					type: 'hbox',
					align: 'center',
					pack: 'center'
				},

				defaults: {
					style: 'margin: 0 10px 30px 10px'
				},

				items: [{
					xtype: 'button',
					enableLocale: true,
					locales:      { text: 'cuisine.button.clear' },
					ui:    'normal',
					listeners: {
						tap: function(me) {
							Ext.each(me.up('cuisinemenu').query('fieldset > checkboxfield'), function(item) {
								item.uncheck();
							});
						}
					}
				},{
					xtype: 'button',
					enableLocale: true,
					locales:      { text: 'cuisine.button.checkall' },
					listeners: {
						tap: function(me) {
							Ext.each(me.up('cuisinemenu').query('fieldset > checkboxfield'), function(item) {
								item.check();
							});
						}
					}
				}]
			},{
				xtype: 'spacer'
			},{
				xtype: 	'panel',
				flex: 	10,
				id: 	'noCuisineMessage',
				html: 	'<div style="text-align: center; margin-top: 100px;">Sorry, cuisine info was not loaded</div>',
				hidden: true
			},{
				xtype: 'container',
				id:    'cuisineMenuList',
				layout: {
					type: 'hbox',
					align: 'start',
					pack: 'center'
				},

				defaults: {
					width: 240
				},

				items: [{
					xtype: 'fieldset',
					id: 'cuisineSettings1',
					//enableLocale : false,
					//locales : { instructions : 'mapa.settings.instructions' },
					defaults: {
						labelWidth: '130px',
						xtype: 'checkboxfield',
						enableLocale : false
					}
				},{
					xtype: 'fieldset',
					id: 'cuisineSettings2',
					//enableLocale : false,
					//locales : { instructions : 'mapa.settings.instructions' },
					defaults: {
						labelWidth: '130px',
						xtype: 'checkboxfield',
						enableLocale : false
					}
				},{
					xtype: 'fieldset',
					id: 'cuisineSettings3',
					//enableLocale : false,
					//locales : { instructions : 'mapa.settings.instructions' },
					defaults: {
						labelWidth: '130px',
						xtype: 'checkboxfield',
						enableLocale : false
					}
				}]
			}]
		}]
	}
});

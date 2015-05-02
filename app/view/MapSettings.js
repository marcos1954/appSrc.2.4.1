/**
 *
 */
Ext.define("GayGuideApp.view.MapSettings", {
	extend: "Ext.Panel",

	alias: 'widget.mapmenu',
	xtype: 'mapmenu',

	config: {
		floating:      true,
		hidden:        true,
		centered:      true,
		modal:         true,
		hideOnMaskTap: false,
		fullscreen:    false,
		layout:        'fit',
		scroll:        'vertical',
		width:         '80%',
		height:        '90%',
		minHeight:     300,
		minWidth:      300,
		maxHeight:     500,
		maxWidth:      400,
		showAnimation: 'pop',
		hideAnimation: 'popOut',

		items: [{
			docked:       'top',
			xtype:        'titlebar',
			enableLocale: true,
			locales :     { title : 'mapa.settings.title' },
			ui:           'dark',

			items: [{
				align:       'left',
				locales :    { text : 'buttons.cancel' },
				ui:          'normal',
				itemId:       'cancel'
			},{
				align:        'right',
				locales :     { text : 'buttons.done' },
				ui:           'confirm',
				itemId:       'done'
			}]
		},
		{
			xtype: 'formpanel',

			items: [{
				id:            'mapSettings',
				xtype:         'fieldset',

				defaults: {
					labelWidth: '70%',
					xtype: 'iconcheckbox',
					cls: 'ggv-form-label',
					enableLocale : true,
                    labelIconPosition: 'left'
				},

				items: [{
					itemId:      'favs',
					locales: { label: 'mapa.settings.favs' },
                    labelIcon: 'http://www.gayguidevallarta.com/images/star.png'
				},{

					itemId:      'bars',
					locales: { label: 'mapa.settings.bars' },
                    labelIcon: './resources/images/mapicons/marker2-bars'
				},{
					id:      'rest',
					locales: { label: 'mapa.settings.restaurants' },
                    labelIcon: './resources/images/mapicons/marker2-restaurants'
				},{
					itemId:      'cafe',
					locales: { label: 'mapa.settings.cafe' },
                    labelIcon: './resources/images/mapicons/marker-coffee'
				},{
					itemId:      'beach',
					locales: { label: 'mapa.settings.beaches' },
                    labelIcon: './resources/images/mapicons/marker2-beaches'
				},{
                    itemId:      'atm',
					locales: { label: 'mapa.settings.atms' },
                    labelIcon: './resources/images/mapicons/marker-atm'
				},{
					id:      'shop',
					locales: { label: 'mapa.settings.shopping' },
                    labelIcon: './resources/images/mapicons/marker2-shops'
				},{
					itemId:    'art',
					locales: { label: 'mapa.settings.gallery' },
                    labelIcon: './resources/images/mapicons/marker-gallery'
				},{
					itemId:      'desk',
					locales: { label: 'mapa.settings.tourdesk' },
                    labelIcon: './resources/images/mapicons/marker-tourdesk'
				},{
					itemId:      'tour',
					locales: { label: 'mapa.settings.tours' },
                    labelIcon: './resources/images/mapicons/marker2-tours'
				},{
					itemId:      'gym',
					locales: { label: 'mapa.settings.gyms' },
                    labelIcon: './resources/images/mapicons/marker2-gyms'
				},{
					itemId:      'spa',
					locales: { label: 'mapa.settings.spa' },
                    labelIcon: './resources/images/mapicons/marker-spa'
				},{
					itemId:      'hotel',
					locales: { label: 'mapa.settings.hotels' },
                    labelIcon: './resources/images/mapicons/marker2-hotels'
				},{
					itemId:      'org',
					locales: { label: 'mapa.settings.org' },
                    labelIcon: './resources/images/mapicons/marker2-organizations'
				},{
					itemId:      're',
					locales: { label: 'mapa.settings.re' },
                    labelIcon: './resources/images/mapicons/marker-re'
				},{
					itemId:      'event',
					locales: { label: 'mapa.settings.events' },
                    labelIcon: './resources/images/mapicons/marker2-events'
				},{
					itemId:      'other',
					locales: { label: 'mapa.settings.other' },
                    labelIcon: './resources/images/mapicons/marker2-hotels'
				}]
			}]
		}]
	}
});

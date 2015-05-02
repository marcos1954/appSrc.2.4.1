/**
 *
 */
Ext.define("GayGuideApp.view.phone.PlacesMenu", {
	extend: "Ext.Container",
	xtype: 'placesmenuphone',

	config: {
		id:                   'placesMenu',
		layout:               'fit',
		
		items: [{
			docked:           'top',
			xtype: 	          'titlebar',
			cls:              'sliderToolbar',
			enableLocale:     true,
			locales:          { title : 'places.menu.title' },

			items: [{
				xtype:        'button',
				iconMask:     true,
				iconCls:      'list',
				name:         'slidebutton'
			}]
		},{
			xtype:            'placesmenu',
			ui:               'round',
			disableSelection: true
		}]
	}
});

Ext.define("GayGuideApp.view.phone.PlacesPixMenu", {
	extend: "Ext.Container",
	xtype: 'placespixmenuphone',
    
    config: {
        
        id:                   'placesPixMenu',
		layout:               'fit',
		
		items: [{
			docked:           'top',
			xtype: 	          'titlebar',
			cls:              'sliderToolbar',
			enableLocale:     true,
			locales:          { title : 'places.pixmenu.title' },

			items: [{
				xtype:        'button',
				iconMask:     true,
				iconCls:      'list',
				name:         'slidebutton'
			}]
		},{
			xtype:            'carousel',
			direction:        'vertical',
			indicator:        false,
            cls:              'ggv-pixmenu-carousel',
            defaults: {
				mode:             'background',
                styleHtmlContent: true,
				styleHtmlCls:     'ggv-pixmenu-text'
            }
		}]
    }
});
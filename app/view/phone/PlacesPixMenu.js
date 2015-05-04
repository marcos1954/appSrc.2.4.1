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
			direction:        'horizontal',
			indicator:        false,
            cls:              'ggv-pixmenu-carousel noSliderToolbar',
            defaults: {
				mode:             'background',
                styleHtmlContent: true,
				styleHtmlCls:     'ggv-pixmenu-text'

            },
        
//            items: [
//                {
//					xtype: 'img',
//                  src :  'resources/images/Daylife.jpg',
//					html:  'Daylife',
//					listeners: {
//						tap: function() {
//							if (GayGuideApp.ggvstate)
//								GayGuideApp.ggvstate['placesList'] = null;
//							GayGuideApp.app.getApplication().redirectTo('placeslist/D', true);
//						}
//					}
//                },
//				{
//					xtype: 'img',
//                    src :  'resources/images/Nightlife.jpg',
//					html:  'Nightlife',
//					listeners: {
//						tap: function() {
//							if (GayGuideApp.ggvstate)
//								GayGuideApp.ggvstate['placesList'] = null;
//							GayGuideApp.app.getApplication().redirectTo('placeslist/N', true);
//						}
//					}
//                },
//				{
//					xtype: 'img',
//                    src :  'resources/images/Restaurants.jpg',
//					html:  'Restaurants',
//					listeners: {
//						tap: function() {
//							if (GayGuideApp.ggvstate)
//								GayGuideApp.ggvstate['placesList'] = null;
//							GayGuideApp.app.getApplication().redirectTo('placeslist/R', true);
//						}
//					}
//                }
//            ]
		}]
    }
});
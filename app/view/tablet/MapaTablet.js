/**
 *
 */
Ext.define("GayGuideApp.view.tablet.MapaTablet", {
	extend: "GayGuideApp.view.MainMapView",

	xtype:  'mapatablet',

	config: {
		layout:               'card',
		itemId:               'Mapa',
        autoDestroy:          false,
		
		items: [{
			docked:           'top',
			xtype:            'statusbar'
		},{
			itemId:           'mapToolbar',
			docked:           'top',
			cls:              'sliderToolbar',
			xtype:            'toolbar',

			layout:           { pack: 'center' },

			items: [{
				itemId:       'mapNav',
				xtype:        'button',
				height:       40,
				iconCls:      'list',
				ui:           'plain',
				name:         'slidebutton',
				listeners: {
					tap: function(me) {
						var view = me.up('mapatablet');
						
						view.doNav(me);
					}
				}
			},{
				xtype:        'spacer'
			},{
				locales:      { text: 'mapa.button.pvr' },
				ui:           'ggv',
				enableLocale: true,
				listeners: {
					tap: function (me) {
						me.up('mapatablet').down('mappanel').panZoom('PVR');
					}
				}
			},{
				locales:       { text: 'mapa.button.gaypvr' },
				ui:            'ggv',
				enableLocale:  true,
				listeners: {
					tap: function (me) {
						me.up('mapatablet').down('mappanel').panZoom('GayPVR');
					}
				}
			},{
				locales:       { text: 'mapa.button.olasaltas' },
				ui:            'ggv',
				enableLocale:  true,
				listeners: {
					tap: function (me) {
						me.up('mapatablet').down('mappanel').panZoom('OlasAltas');
					}
				}
			},{
				locales:       { text: 'mapa.button.cardenas' },
				ui:            'ggv',
				enableLocale:  true,
				listeners: {
					tap: function (me) {
						me.up('mapatablet').down('mappanel').panZoom('Cardenas');
					}
				}
			},{
				xtype:          'spacer'
			},{
				itemId:         'mapGpsButton',
				iconCls:        'locate1',
				ui:             'plain',
				listeners: {
					tap: function(me) {
						var view = me.up('mapatablet');
						
						view.doGpsButtonTap(me);
					}
				}
			},{
				itemId:         'mapSettingButton',
				ui:             'plain',
				cls:            'faved',
				iconCls:        'locate'            
			}]
		},{
            xtype: 'container',
            layout: 'fit',
            items: [{
                xtype:  'cachemap',
                itemId: 'mainMap',
                layout: 'fit',
                trackLoc: true,
                cacheLocation:   true,
                cacheDirections: false,
                cacheDisplayMarkers: true,
                cacheIds: []
            },{
                docked: 'right',
                xtype:  'mapiconsidebar',
                itemId: 'mapsidebar'
            }]
        }]
	}
});

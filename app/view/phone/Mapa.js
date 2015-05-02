/**
 *
 */
Ext.define("GayGuideApp.view.phone.Mapa", {
	extend: "GayGuideApp.view.MainMapView",
	requires: [ 'Ext.Map', 'Ext.Toolbar', 'Ext.Button' ],

	xtype:        'mapa',

	config:  {
		cls:                  'ggv-mapa',
        autoDestroy:          false,
		itemId:               'Mapa',
		layout:               'card',
		items: [{
			docked:           'top',
			itemId:           'mapToolbar',
			cls:              'sliderToolbar',
			xtype:            'toolbar',
			layout:           { pack: 'center' },

			defaults: {
				xtype:        'button',
				enableLocale: true,
				ui:           'ggv'
			},

			items: [{
				id:           'mapNav',
				xtype:        'button',
				ui:           'plain',
				iconCls:      'list',
				name:         'slidebutton',
				listeners: {
					tap: function(me) {
						var view = me.up('mapa');
						view.doNav(me);
					}
				}
			},{
				xtype:        'spacer'
			},{
				id:           'mapGpsButton',
				iconCls:      'locate1',
				ui:           'plain',
				listeners: {
					tap: function(me) {
						var view = me.up('mapa');
						view.doGpsButtonTap(me);
					}
				}
            },{
				id:           'mapMainOptions',
				ui:           'plain',
				iconCls:      'zoom2'
            },{
				itemId:         'mapSettingButton',
				ui:             'plain',
				cls:            'faved',
				iconCls:        'locate'
			}]
        },{
            layout: 'hbox',
            items: [{
                width:  '100%',
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

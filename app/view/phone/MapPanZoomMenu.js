/**
 *
 */
Ext.define("GayGuideApp.view.phone.MapPanZoomMenu", {
	extend: "Ext.ActionSheet",
	xtype: 'mappanzoommenu',

	config: {
		defaults: {
			height:       50
		},

		items: [{
			docked:       'top',
			xtype:        'titlebar',
			enableLocale: true,
			locales :     { title : 'mapa.choices.panto' },
			ui:           'light'
		},{
			ui:           'confirm',
			enableLocale: true,
			locales:      { text: 'mapa.button.pvr' },
			text:         'Puerto Vallarta',
			listeners: {
				tap: function (me) {
					me.up('mappanzoommenu').destroy();
					GayGuideApp.cards.viewport.container.down('mapa  mappanel').panZoom('PVR');
				}
			}
		},{
			ui:           'confirm',
			enableLocale: true,
			locales:      { text: 'mapa.button.gaypvr' },
			listeners: {
				tap: function (me) {
					me.up('mappanzoommenu').destroy();
					GayGuideApp.cards.viewport.container.down('mapa  mappanel').panZoom('GayPVR');
				}
			}
		},{
			ui:           'confirm',
			enableLocale: true,
			locales:      { text: 'mapa.button.olasaltas' },
			listeners: {
				tap: function (me) {
					me.up('mappanzoommenu').destroy();
					GayGuideApp.cards.viewport.container.down('mapa  mappanel').panZoom('OlasAltas');
				}
			}
		},{
			ui:           'confirm',
			enableLocale: true,
			locales:      { text: 'mapa.button.cardenas' },
			listeners: {
				tap: function (me) {
					me.up('mappanzoommenu').destroy();
					GayGuideApp.cards.viewport.container.down('mapa  mappanel').panZoom('Cardenas');
				}
			}
		},{
			ui:           'decline',
			text:         'cancel',
			listeners: {
				tap: function(me) {
					me.up('mappanzoommenu').destroy();
				}
			}
		}]
	}
});

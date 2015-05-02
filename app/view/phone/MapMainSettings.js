/**
 *
 */
Ext.define("GayGuideApp.view.phone.MapMainSettings", {
	extend: "Ext.ActionSheet",

	xtype: 'mapmainmenu',

	config: {
		defaults: {
			height: 50,
			enableLocale: true
		},

		items: [{
			ui:   'confirm',
			locales:      { text: 'mapa.choices.panto' },
			id:   'panZoomTo'
		},{
			ui:   'confirm',
			locales:      { text: 'mapa.choices.chgmarkers' },
			id:   'setMapMarkers'
		},{
			ui:   'decline',
			locales:      { text: 'buttons.cancel' }
		}]
	}
});

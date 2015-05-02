/**
 * Google Map with geoMarker and directions
 */
Ext.define("GayGuideApp.view.PlacesMap", {
	extend: 'GayGuideApp.view.MarkerMap',
	alias: 'widget.placesmap',
	xtype: 'placesmap',

	config: {
		itemId:                    'placesMap',
		layout:                    'fit',
		mapOptions: {
			zoom:                  17,
			zoomControl:           true,
			mapTypeControl:        false,
			streetViewControl:     false,
			mapTypeId:             google.maps.MapTypeId.ROADMAP
		}
	}
});

/**
 *
 */
Ext.define("GayGuideApp.view.tablet.PlacesDetailContainer", {
	//extend: "GayGuideApp.view.ContainerLite",
	extend: "Ext.Container",

	config: {
		id: 'placesDetailContainer',
		layout: 'card',
		items: [{
			xtype: 'placesdetailtablet',
			itemId: 'placesDetail'
		}]
	}
});

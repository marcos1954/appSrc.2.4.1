/**
 * GayGuideApp.profile.Phone
 */
Ext.define('GayGuideApp.profile.Phone', {
	extend: 'Ext.app.Profile',


	requires: [],

	config: {
		name: 'Phone',
		views: [
			'PhoneViewport',
			'Main',

			'PlacesListPhone',

			'FavsList',

			'PhoneEventsList',
			'PhoneEventsDetail',

			'Mapa',
			'MapMainSettings',
			'MapPanZoomMenu',

			'DetailPhone',
			'NotesListPhone',

			'Settings'
		]
	},

	launch: function() {
		GayGuideApp.ggv.profile = 'Phone';
		GayGuideApp.useLocalStorage = false;
		GayGuideApp.ios6 = true;
		GayGuideApp.narrowLimit = 400;

		if (window.navigator["userAgent"].match(/OS 6(_\d)+ like Mac OS X/i)) {
			GayGuideApp.useLocalStorage = false;
			GayGuideApp.ios6 = true;
		}

		if (window.navigator["userAgent"].match(/OS 5(_\d)+ like Mac OS X/i)) {
			GayGuideApp.useLocalStorage = false;
			GayGuideApp.ios6 = false;
		}
	},

	isActive: function() {
		if (window.navigator["userAgent"].match(/iPad/))
			return false;
		
		return Ext.os.is.Phone;
		return true;
	}
});

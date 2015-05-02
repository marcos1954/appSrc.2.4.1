/**
 * GayGuideApp.profile.Tablet
 */
Ext.define('GayGuideApp.profile.Tablet', {
	extend: 'Ext.app.Profile',

	config: {
		name: 'Tablet',
		views: [
			'Main',
			'PlacesMenuTablet',
			'PlacesListTablet',
			'DetailTablet',
			'EventsListTablet',
			'EventsDetailTablet',
			'FavsList',
			'MapaTablet',
			'GalleryTablet',
			'Notes',
			'NotesListTablet',
			'Settings',
			'Statusbar'
		]
	},

	launch: function() {
		GayGuideApp.ggv.profile = 'Tablet';
		GayGuideApp.useLocalStorage = false;
		GayGuideApp.ios6 = true;
		GayGuideApp.narrowLimit = 730;

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
			return true;
		return !Ext.os.is.Phone;
		return false;
	}
});

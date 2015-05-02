/**
 *
 */
Ext.define("GayGuideApp.store.Favorites", {
	extend: "Ext.data.Store",

	requires: [
		'Ext.data.proxy.LocalStorage'
	],

	config: {
		storeId:  'favorites',
		model:    'GayGuideApp.model.Favorites',
		autoload: true,
		proxy: {
			type: 'localstorage',
			id:   'favorites'
		}
	}
});

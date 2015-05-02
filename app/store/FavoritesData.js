/**
 *
 */
Ext.define("GayGuideApp.store.FavoritesData", {
	extend: "Ext.data.Store",

	config: {
		model:     'GayGuideApp.model.Business',
		id:        'favsListStore',
		storeId:   'favsListStore',
		autoload:  false,

		sorters: [{
			property: 'list_name',
			direction: 'ASC'
		}]
	}
});

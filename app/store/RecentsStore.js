Ext.define("GayGuideApp.store.RecentsStore", {
	extend: "Ext.data.Store",

	config: {
		model:     'GayGuideApp.model.Business',
		id:        'recentsListStore',
		storeId:   'recentsListStore',
		autoload:  false,
		destroyRemovedRecords: true,
		syncRemovedRecords: false,

		proxy: {
			type: 'memory'
		},

		sorters: [{
			property: 'lastVisit',
			direction: 'DESC'
		}]
	}
});
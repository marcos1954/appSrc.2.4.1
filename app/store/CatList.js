Ext.define("GayGuideApp.store.CatList", {
	extend: "Ext.data.Store",

	config: {
		model:     'GayGuideApp.model.Cats',
		id:        'catListStore',
		storeId:   'catListStore',
		autoload:  false,
		destroyRemovedRecords: true,
		syncRemovedRecords: false,

		proxy: {
			type: 'memory'
		},

		sorters: [{
			property: 'catpageorder',
			direction: 'ASC'
		
		},{
			sorterFn: function(a,b) {
				var name1 = (a.data.catpage == a.data.catcode),
					name2 = (b.data.catpage == b.data.catcode);
				if (name1 == name2) return 0;
				return (name1 > name2) ? -1 : 1;
			}
		},{
			property: 'catname',
			direction: 'ASC'
		}]
	}
});
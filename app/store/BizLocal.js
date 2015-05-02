/**
 *
 */
Ext.define("GayGuideApp.store.BizLocal", {
	extend: "Ext.data.Store",

	config: {
		id:         'bizstorelocal',
		storeId:    'bizstorelocal',
		model:      'GayGuideApp.model.Business',
		autoLoad:   false,
		autoSync:   false,
		groupField: 'list_cat_name',
		groupDir:   'ASC',
		sortRoot:   'data',

		grouper: {
			groupFn: function(record) {
				return record.get('list_cat_name');
			}
		},
		sorter: [{
			property: 'list_name',
			root: 'data',
			direction: 'ASC'
		}],
		proxy: {
			type: 'localstorage',
			id: 'ggvBiz'
		}
	}
});

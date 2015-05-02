/**
 *
 */
Ext.define("GayGuideApp.store.Main", {
	extend: "Ext.data.Store",

	config: {
		id:          'mainstore',
		storeId:     'mainstore',
		model:       'GayGuideApp.model.Business',
		autoLoad:    false,

		groupField:  'list_cat_name',
		groupDir:    'ASC',
		grouper: {
			groupFn: function(record) {
				return record.get('list_cat_name');
			}
		},
		sortRoot: 'data',
		sorter: [{
			property:  'list_name',
			root:      'data',
			direction: 'ASC'
		}],
		proxy: {
			type:      'memory'
		}
	},
	localLoad: function() {
		alert('localLoad');
	}
});

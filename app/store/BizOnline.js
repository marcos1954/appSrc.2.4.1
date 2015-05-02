/**
 *
 */
Ext.define("GayGuideApp.store.BizOnline", {
	extend: "Ext.data.Store",

	config: {
		id:           'bizstoreOnline',
		storeId:      'bizstoreOnline',
		model:        'GayGuideApp.model.Business',
		autoLoad:     false,
		groupField:   'list_cat_name',
		groupDir:     'ASC',
		sortRoot:      'data',
		grouper: {
			groupFn: function(record) {
				return record.get('list_cat_name');
			}
		},
		sorter: [{
			property:  'list_name',
			root:      'data',
			direction: 'ASC'
		}],
		proxy: {
			type:      'jsonp',
			url:       GayGuideApp.jsonBase + '/ajax/json.listing.php',

			enablePagingParams: false,
			timeout:    35000,
			noCache : false,
			reader: {
				type:         'json',
				rootProperty: 'MAIN_LISTINGS'
			},
			listeners: ({
				exception: function() {
					return false;
				}
			})
		}
	}
});

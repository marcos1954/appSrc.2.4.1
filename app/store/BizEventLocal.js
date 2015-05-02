/**
 *
 */
Ext.define("GayGuideApp.store.BizEventLocal", {
	extend: "Ext.data.Store",

	config: {
		id:       'bizeventstore',
		storeId:  'bizeventstore',
		model:    'GayGuideApp.model.Event',
		autoload: false,

		proxy: {
			type: 'localstorage',
			id:   'ggvBizEvent'
		}
	}
});

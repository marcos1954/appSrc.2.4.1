Ext.define('GayGuideApp.controller.override.Application', {
    override : 'Ext.app.Application',
    
	//Add the additional 'addToHistory' parameter so it can be passed into the dispatch call. 
	 redirectTo: function(url,addToHistory) {
		if (Ext.data && Ext.data.Model && url instanceof Ext.data.Model) {
			var record = url;

			url = record.toUrl();
		}

		var decoded = this.getRouter().recognize(url);

		if (decoded) {
			decoded.url = url;
			if (record) {
				decoded.data = {};
				decoded.data.record = record;
			}
			return this.dispatch(decoded,addToHistory);
		}
	}
});

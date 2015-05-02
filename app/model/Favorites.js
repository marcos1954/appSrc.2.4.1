/**
 * GayGuideApp.model.Favorites
 *   favs and notes info about a business
 *
 */
Ext.define("GayGuideApp.model.Favorites", {
	extend: 'Ext.data.Model',

	config: {
		identifier:'uuid',
		idProperty: 'id',
		fields: [{
			name: 'id',
			type: 'auto'
		},{
			name: "bid",
			type: "int"
		},{
			name: "something",
			type: "string"
		},{
			name: "fav",
			type: "int"
		},{
			name: "notes",
			type: "string"
		},{
			name: "lastVisit",
			type: "int"
		}],
		proxy: {
			type: 'localstorage',
			id:   'favorites'
		}
	}
});

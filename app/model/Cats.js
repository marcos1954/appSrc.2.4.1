/**
 * GayGuideApp.model.Tags
 *   tag items for Business Categories
 *
 *   typically cuisine types
 *
 */
Ext.define("GayGuideApp.model.Cats", {
	extend: 'Ext.data.Model',

	config: {
		fields: [{
			name: "catname",
			type: "string"
		},{
			name: "catcode",
			type: "string"
		},{
			name: "catpage",
			type: "string"
		},{
			name: "catpageorder",
			type: "number"
		},{
			name: "catcount",
			type: "number"
		}]
	}
});
/**
 * GayGuideApp.model.Tags
 *   tag items for Business Categories
 *
 *   typically cuisine types
 *
 */
Ext.define("GayGuideApp.model.Tags", {
	extend: 'Ext.data.Model',

	config: {
		fields: [{
			name: "codekey",
			type: "string"
		},
		{
			name: "codeGroup",
			type: "string"
		},
		{
			name: "name",
			type: "string"
		},{
			name: "tagcount",
			type: "number"
		}]
	}
});

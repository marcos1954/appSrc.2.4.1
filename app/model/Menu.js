/**
 * GayGuideApp.model.Menu
 *   main menu stored items for Business Categories
 *
 */
Ext.define("GayGuideApp.model.Menu", {
	extend: 'Ext.data.Model',

	config: {
		name:'Menu',
		fields: [{
			name: "id",
			type: "int"
		},{
			name: "localeKey",
			type: "string"
		},{
			name: "menuOrder",
			type: "int"
		},{
			name: "menuName",
			type: "string"
		},{
			name: "assocListSelect",
			type: "string"
		},{
			name: "menuAuxText",
			type: "string"
		},{
			name: "menuIcon",
			type: "string"
		},{
			name: "base64",
			type: "string"
		}]
	}
});

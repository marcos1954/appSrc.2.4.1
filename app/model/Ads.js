/**
 * GayGuideApp.model.Ads
 *
 *
 *
 *
 *
 */
Ext.define("GayGuideApp.model.Ads", {
	extend: 'Ext.data.Model',

	config: {
		fields: [{
			name: "id",
			type: "int"
		},{
			name: "bizId",
			type: "int"
		},{
			name: "adText",
			type: "string"
		},{
			name: "priority",
			type: "int"
		},{
			name: "type",
			type: "string"
		},{
			name: "tpl",
			type: "string"
		},{
			name: "arg1",
			type: "string"
		},{
			name: "arg2",
			type: "string"
		},{
			name: "arg3",
			type: "string"
		},{
			name: "arg4",
			type: "string"
		}]
	}
});

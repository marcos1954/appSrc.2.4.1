/**
 * GayGuideApp.model.Atm
 *
 *
 *
 *
 *
 */
Ext.define("GayGuideApp.model.Atm", {
	extend: 'Ext.data.Model',

	config: {
		fields: [{
			name: "id",
			type: "int"
		},{
			name: "list_latitude",
			type: "string"
		},{
			name: "list_longitude",
			type: "string"
		}]
	}
});

/**
 * GayGuideApp.model.Event
 *   the associated model of events for the Places store
 *
 *
 *
 *
 */
Ext.define("GayGuideApp.model.Event", {
	extend: 'GayGuideApp.model.BaseModel',

	config: {idProperty: 'uid',
		identifier: 'uuid',
		fields: [{
			name: "uid",
			type: "auto"
		},{
			name: "id",
			type: "int"
		},{
			name: "business_id",
			type: "int"
		},{
			name: "nameEvent",
			type: "string"
		},{
			name: "event_recurs",
			type: "string"
		},{
			name: "timesEvent",
			type: "string"
		},{
			name: "category_name",
			type: "string"
		},{
			name: "locationEvent",
			type: "string"
		},{
			name: "flyer",
			type: "string"
		},{
			name: "descEvent",
			type: "string"
		},{
			name: "descEventLong",
			type: "string"
		}],

		belongsTo: 'GayGuideApp.model.Business'
	}
});

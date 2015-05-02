/**
 * GayGuideApp.model.Today
 *   event item for event store
 *
 *   contains one piece of event info for a given day
 *
 */
Ext.define("GayGuideApp.model.Today", {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.identifier.Uuid'
    ],

    config: {
        idProperty: 'uid',
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
            name: "fav",
            type: "int"
        },{
            name: "startTime",
            type: "string"
        },{
            name: "eventToday",
            type: "string"
        },{
            name: "eventList",
            type: "string"
        },{
            name: "listOrder",
            type: "int"
        },{
            name: "listGroup",
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
            name: "catnameEvent",
            type: "string"
        },{
            name: "locationEvent",
            type: "string"
        },{
            name: "descEvent",
            type: "string"
        },{
            name: "descEventLong",
            type: "string"
        },{
            name: "minutes_into_day",
            type: "int"
        },{
            name: "list_name",
            type: "string"
        },{
            name: "list_latitude",
            type: "string"
        },{
            name: "list_longitude",
            type: "string"
        },{
            name: "list_addr1",
            type: "string"
        },{
            name: "list_addr2",
            type: "string"
        },{
            name: "list_addr3",
            type: "string"
        },{
            name: "list_phone",
            type: "string"
        },{
            name: "logoEventATTRS",
            type: "string"
        },{
            name: "sunsetTime",
            type: "string"
        },{
            name: "event_flyer",
            type: "string"
        },{
            name: "timedataEvent",
            type: "string"
        },{
            name: "timeStringStart",
            type: "string"
        },{
            name: "timeStringEnd",
            type: "string"
        }]
    }
});

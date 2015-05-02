/**
 *
 */
Ext.define("GayGuideApp.store.EventsStore", {
    extend: "Ext.data.Store",

    config: {
        id: 'eventsStore',
        storeId: 'eventsStore',
        model: 'GayGuideApp.model.Today',
        autoLoad: false,

        groupField: 'eventList',
        groupDir: 'ASC',
        grouper: {
            groupFn: function(record) {
                return record.get('eventList');
            },
            sortProperty: 'listOrder'
        },

        sorters: [{
            property: 'listOrder',
            direction: 'ASC',
            root: 'data'
        },{
            property: 'minutes_into_day',
            direction: 'ASC',
            root: 'data'
        },{
            property: 'nameEvent',
            direction: 'ASC',
            root: 'data'
        }],

        proxy: {
            type: 'jsonp',
            url: GayGuideApp.jsonBase+'/ajax/json.calendar.php?display=day',
            enablePagingParams: false,

            timeout: 25000,
            extraParams: {
                lang: GayGuideApp.lang
            },
            reader: {
                type: 'json',
                rootProperty: 'MAIN_EVENTS'
            }
        }
    }
});

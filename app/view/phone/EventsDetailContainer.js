/**
 *
 */
Ext.define("GayGuideApp.view.phone.EventsDetailContainer", {
    extend: "Ext.Container",
    alias: "widget.eventsdetailcontainer",

    config: {
        id:         'eventsDetailContainer',
        layout:     'card',
        items: [{
            xtype:  'eventsdetailphone',
            itemId: 'eventsDetail'
        }]
    }
});

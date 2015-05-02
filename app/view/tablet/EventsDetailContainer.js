/**
 *
 */
Ext.define("GayGuideApp.view.tablet.EventsDetailContainer", {
    extend: "Ext.Container",
    alias: "widget.eventsdetailcontainer",

    config: {
        id: 'eventsDetailContainer',
        layout: 'card',
        items: [{
            xtype:  'eventsdetailtablet',
            itemId: 'eventsDetail'
        }]
    }
});

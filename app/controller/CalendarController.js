/**
 * GayGuideApp.controller.CalendarController
 *     handles the native calendar
 *
 *
 */
Ext.define("GayGuideApp.controller.CalendarController", {
    extend: "Ext.app.Controller",

    requires: [],

    config: {
        debug: false,
        
        calendarName: 'Calendar',
        
        before: {},
        
        routes: {},
        
        refs: {},
        
        control: {}
        
    },
    
    /*
     * addCalendarEntry - add calendar entry to native calendar
     *
     *
     *
     *
     *
     *
     *
     */
    addCalendarEntry: function(itemid) {
        
        var store = GayGuideApp.store.today,
            record = store.findRecord('id', itemid, 0, false, false, true);
            
        if (!record) return;    
            
        var title = record.data.nameEvent,
            location = record.data.locationEvent,
            start,
            end,
            notes = record.data.descEvent,
            date = GayGuideApp.ggv.today;
            
        
            
        
        
        
        
        

        
    },
    
});
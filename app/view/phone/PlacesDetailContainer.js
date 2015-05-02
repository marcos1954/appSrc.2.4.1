/**
 *
 */
Ext.define("GayGuideApp.view.phone.PlacesDetailContainer", {
    extend: "Ext.Container",

    config: {
        id:         'placesDetailContainer',
        layout:     'card',
        items: [{
            xtype:  'placesdetailphone',
            itemId: 'placesDetail'
        }]
    }
});

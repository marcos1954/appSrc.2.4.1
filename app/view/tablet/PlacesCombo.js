/**
 *
 */
Ext.define("GayGuideApp.view.tablet.PlacesCombo", {
    extend: "Ext.Panel",
    alias: 'widget.placescombo',

    requires: [
        "GayGuideApp.view.CacheMap"
    ],

    config: {
        layout : {
            type  : 'vbox',
            align : 'stretch'
        },
        cls:    'ggv-places-combo',

        items: [{
            flex:         1,
            scrollable:   null,  //// null ????

            layout: {
                type:     'hbox',
                align:    'stretch'
            },

            items: [{
                itemId:   'placesComboInfo',
                xtype:    'placesinfo',
                flex:     1
            },{
                itemId:   'placesComboMap',
                xtype:    'cachemap',
                debug:    false,
                trackLoc: false,
                center:   true,
                zoom:     15,
                flex:     1,
                style:    'margin: 10px 10px 0 0',
                noLinkInInfoWindow:    true,

                cacheFitBounds:        false,
                cacheLocation:         false,
                cacheDirections:       false
            }]
        },{
            //id:     'placesComboPhotos',
            itemId: 'placesComboPhotos',
            xtype:  'placesphotobar',
            height: '220px'
        }]
    },

    setData: function(data) {
        this.down('#placesComboMap').setData(data);
        this.down('#placesComboInfo').setData(data);
        this.down('#placesComboPhotos').setHtml('');
        GayGuideApp.app.getApplication().getController('DetailController').updateComboPhotos(this, data);
    }
});

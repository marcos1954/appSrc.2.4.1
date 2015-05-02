/**
 * GayGuideApp.view.MainMapView
 *   button methods, marker and toolbar setups for GayGuideApp's main map
 *   phone and tablet versions of #Mapa view, extend from this base.
 *
 */
Ext.define("GayGuideApp.view.MainMapView", {
    extend: "Ext.Container",

    xtype:  'mainmapview',

    config : {},

    /**
     * doMainMapSetup - sets the toolbar icons css class to reflect current state.
     */
    doMainMapSetup: function() {
        var view = this;
        if (!view) return;

        var app = GayGuideApp,
            gpsButton = view.down('#mapGpsButton'),
            gpsState = app.ggv.gps != "off";

        Ext.defer(function() {
           try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {};
        }, 600);
        
        if (gpsButton) {
            gpsButton.setHidden(!gpsState);
        }
    },

    /**
     *
     *
     */
    doDisplayMapMarkers: function (map) {
        var grouplist = [],
            x = GayGuideApp.ggv.markerStatus,
            mapCard = GayGuideApp.cards.MarkerMap;

        if (!mapCard) return;

        for (var key in x) {
            if (x.hasOwnProperty(key) && x[key]=='y')
                grouplist.push(key); 
        }

        mapCard.showMarkers(grouplist);
    },

    /**
     * responds to gpsButton tap event by moveing the map center to the current location.
     * @param {Ext.Button} me the button tapped
     */
    doGpsButtonTap: function (me) {
        try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {};

        if (GayGuideApp.ggv.gps != 'off') {
            if (GayGuideApp.ggv.gpsPosition) {
                me.up('#Mapa').down('map').getMap().panTo(GayGuideApp.ggv.gpsPosition);
            }
            GayGuideApp.ggv.geo.updateLocation(function(geo){
                if (geo) {
                    me.up('#Mapa').down('map').getMap().panTo(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()));
                }
            });
        }
    },

    /**
     * responds to navButton tap event.
     * @param {Ext.Button} me the button tapped
     */
    doNav: function(me) {
        var x = GayGuideApp.cards.viewport;

        Ext.callback(x.toggleContainer,x,[],0);
    }
});

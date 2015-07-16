/**
 * In some ways this is the essential controller, as it initializes the
 *  ggv object which contains many things used everywhere.
 *
 * controller with general map, with map markers
 *
 * contains markers, directions, bounds, distance routines, and more
 *
 *
 */
Ext.define("GayGuideApp.controller.MapaController", {
    extend: "Ext.app.Controller",

    requires: [
        'GayGuideApp.view.phone.Mapa',
        'GayGuideApp.view.tablet.MapaTablet',
        'Ext.Button',
        'Ext.tab.Panel',
        'Ext.Map'
    ],

    config: {

        routes: {
            'gaypvmap':       'showMap'
        },

        before: {
            'showMap':        'hello'
        },

        refs: {
            MarkerMap:        '#Mapa markermap',
            PinButton:        '#Mapa #mapSettingButton',    // toggle thru mapiconsidebar widths
            panZoomTo:        '#Mapa #mapMainOptions',      // opens PanTo Menu on phone
            mapSidebar:       'mapiconsidebar',
            mapSidebarButton: 'mapiconsidebar button'
        },

        control: {
            PinButton: {
                tap:          'toggleWideSidebar'
            },
            panZoomTo: {
                tap:          'doPanZoomTo'
            },

            mapSidebarButton: {
                tap:          'doMapSidebarButton',
                longtap:      'doMapSidebarLongTap'
            },
            mapSidebar: {
                initialize:    'doMapSidebarInit'
            }  
        }
    },

    /*
     * on long tap of marker buttons we clear all markers
     *
     */
    doMapSidebarLongTap: function(me) {
        var list = GayGuideApp.ggv.markerCatList,
            panel = me.up('mapiconsidebar');
        
        for (var key in GayGuideApp.ggv.markerStatus) {
            if (GayGuideApp.ggv.markerStatus.hasOwnProperty(key)) {
                
                var button = panel.down('#'+key);
                if (button) {
                    GayGuideApp.ggv.markerStatus[key] = 'n';
                    button.removeCls('active');
                }
            }
        }
        
        // note: this will always be followed by a tap event,
        // which will update display of the markers, so we dont worry about that
        //
    },
    
    toggleWideSidebar: function(me) {
        var sidebar = me.up('#Mapa').down('mapiconsidebar');
        
        if (!sidebar.isHidden()) {
            if (sidebar.getWidth() < 100) {
                sidebar.setWidth(200);
                sidebar.removeCls('nolabels');
            }
            else {
                sidebar.setHidden(true);
                sidebar.addCls('nolabels'); 
                sidebar.setWidth(58);
            }
        }
        else {
            sidebar.setHidden(false);
        }
    },
    
    doMapSidebarInit: function(me) {
        if (!me) return;
        
        for (var key in GayGuideApp.ggv.markerStatus) {
            if (GayGuideApp.ggv.markerStatus.hasOwnProperty(key)) {
                
                var button = me.down('#'+key);
                if (button) {
                    if (GayGuideApp.ggv.markerStatus[key] == 'y') 
                        button.addCls('active');
                    else
                        button.removeCls('active');
                }
            }
        }
    },

    /**
     *
     */
    hello: function(action) {
        ggv_log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    /**
     *
     */
    init: function() {
        GayGuideApp.ggv = getGgvUtils(GayGuideApp.ggv || {});
        //alert('mapcontroller init');
    },

    /**
     *
     *
     */
    launch: function () {
        //alert('mapcontroller launch');
        console.log('navigator', navigator);

        GayGuideApp.ggv.geo = Ext.create('Ext.util.GeoLocation', {
            id:                 'geoLocation',
            autoUpdate:         false,
            timeout:            30000,
            maximumAge:         10000,
            frequency:          60000,
            allowHighAccuracy:  true,
            listeners: {
                locationupdate: GayGuideApp.ggv.onGeoUpdate,
                locationerror:  GayGuideApp.ggv.onGeoError
            }
        });

        GayGuideApp.ggv.directionsService = GayGuideApp.ggv.directionsService || new google.maps.DirectionsService();
        GayGuideApp.ggv.directionsDisplay = GayGuideApp.ggv.directionsDisplay || new google.maps.DirectionsRenderer({
            markerOptions: {
                visible: false
            },
            preserveViewport: false,
            polylineOptions: {
                strokeColor: '#a3a',
                strokeWeight: 10,
                strokeOpacity: 0.5
            }
        });
        GayGuideApp.ggv.directionsDisplay.setMap(null);

        if (GayGuideApp.ggv.gps != "off") {
            Ext.defer(GayGuideApp.ggv.geo.setAutoUpdate, 1000, GayGuideApp.ggv.geo.setAutoUpdate, [true]);
            GayGuideApp.ggv.doGeoUpdate();
        }
    },

    /**
     * @private
     *   responds to route dispatch for 'gaypvmap'
     *
     */
    showMap: function() {
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) {
            GayGuideApp.pendingRoute = GayGuideApp.pendingRoute || 'gaypvmap';
            return;
        }

        GayGuideApp.ggv.clearStatusBar();
        reportView('/touch/#gaypvmap', 'Gay PV Map');

        var target  = Ext.Viewport.down('slidenavigationview'),
            mapCard = target.down('#MapContainer');

        if (!mapCard) {
            mapCard = target.container.add({
                xtype:  'container',
                id:     'MapContainer',
                layout: 'card',
                items: [{
                    xtype:   GayGuideApp.isTablet()?'mapatablet':'mapa',
                    layout:  'fit'
                }]
            });
            mapCard.onActivate && mapCard.onActivate(mapCard);
            GayGuideApp.cards.mapPanel = GayGuideApp.cards.MarkerMap;
        }
        //mapCard.down('mainmapview').doMainMapSetup();
        //try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {}

        if (target.container.getActiveItem() == GayGuideApp.cards.placesDetail) {
            target.container.animateActiveItem(mapCard, {
                type:      'slide',
                direction: 'right'
            });
        }
        else {
            target.container.setActiveItem(mapCard);
        }
        
        mapCard.down('mainmapview').doMainMapSetup();
    },


    /**
     *
     *
     */
    doPanZoomTo: function(me, target, eOpts) {
        var c = GayGuideApp.cards.viewport.container;

        if (!c.down('mappanzoommenu')) {
            c.add({ xtype:'mappanzoommenu'});
        }
        c.down('mappanzoommenu').show();
    },

    /**
     *
     *
     */
    doDisplayMapMarkers: function(map) {
        if (map && map.getParent) {
            var view = map.up('#Mapa');

            view && view.doDisplayMapMarkers(map);
        }
    },

    doMapSidebarButton: function(me) {
        if (me.getCls().indexOf('active') >= 0) {
            GayGuideApp.ggv.markerStatus[me.getItemId()] = 'n';
            me.removeCls('active');  
        }
        else {
            GayGuideApp.ggv.markerStatus[me.getItemId()] = 'y';
            me.addCls('active');
        }
        createCookie('iconstatus', GayGuideApp.ggv.joinAssocArray(GayGuideApp.ggv.markerStatus, '|'),  0, 300);
        this.doDisplayMapMarkers(GayGuideApp.cards.MarkerMap);
    }
});

///////////////////////////////////////////////////////////////////
// getGgvUtils()
// setup various variables and function routines
//
function getGgvUtils(ggv)  {

    //ggv = ggv || {};
    ggv = Ext.Object.merge({}, ggv, {

        mapLat:                readCookie('mapLat')  || 20.5,
        mapLong:               readCookie('mapLong') || -106.6,
        mapZoom:               readCookie('mapZoom') || 15,
        googlemaps:            true && navigator.onLine && (typeof (google) == 'object' ),

        mapType:               readCookie('mapType') || google.maps.MapTypeId.HYBRID,
        notes:                 readCookie('notes') || 'on',
        
        calendarEnabled:       readCookie('calendarAccess') == 'on',

        favsOnly:              false,

        /**
         *
         *
         */
        log: function (a1,a2,a3,a4) {
            var     d = new Date;

            ggv_log(d, d.getMilliseconds(), a1, a2, a3);
        },

        /**
         *
         *
         */
        setStatusBar: function(a, b) {
            var where = b || 'center';
            var sts = Ext.Viewport.down('#'+where+'StatusBars');

            if (!GayGuideApp.isTablet() && typeof(sts) != 'undefined') {
                sts.setHtml(a);

            }
        },
        
        clearStatusBar: function() {
            var sts = Ext.Viewport.query('#leftStatusBar, #rightStatusBar, #centerStatusBar ');
            
            Ext.Array.forEach(sts, function(item, index) {
                item.setHtml('');
            }, this);
        },

        /**
         *
         *
         */
        getStatusBar: function(b) {
            var where = b || 'center';
            var sts = Ext.Viewport.down('#'+where+'StatusBar');

            if (typeof(sts) == 'undefined') {
                return '';
            }
            return sts.getHtml();
        },

        ///////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////
        //
        // location functions
        //
        //

        gps:                   readCookie('gps') || 'off',
        directions:            readCookie('directions') || 'off',

        /**
         * doGeoUpdate - request a geo location update
         *
         */
        doGeoUpdate: function () {
            var geo = GayGuideApp.ggv.geo;

            if (geo.position) {
                GayGuideApp.ggv.gpsPosition = new google.maps.LatLng( geo.getLatitude(), geo.getLongitude() );
            }
            this.onGeoUpdate(geo);
            GayGuideApp.ggv.geo.updateLocation();
        },

        /**
         *
         *
         */
        onGeoUpdate: function(geo) {
            if (!geo.position) return;

            var myLatLng = new google.maps.LatLng( geo.getLatitude(), geo.getLongitude() );

            GayGuideApp.ggv.gpsPosition = myLatLng;
            GayGuideApp.ggv.gpsAccuracy = geo.getAccuracy();
            if (GayGuideApp.store.nList) {
                GayGuideApp.store.nList.sort();
                GayGuideApp.cards.browseCard && GayGuideApp.cards.browseCard.refreshNearby();
            }
            if (GayGuideApp.store.sList) {
                GayGuideApp.store.sList.sort();
            }
        },

        /**
         *
         *
         */
        onGeoError: function(geo, timeout, permission, unavail, message) {
            var     msg =   'geo error: ' +
                    (timeout?' timeout ':'') +
                    (permission?' permission denied ':'') +
                    (unavail?' unavail ':'') +
                    message;

            console.error('onGeoError:', msg);
            if (timeout) return;
            GayGuideApp.ggv.setGpsEnabled(false);
        },
        
        joinAssocArray: function objectJoin(obj, sep) {
            var arr = [], p, i = 0;
            for (p in obj)
                if (obj[p] == 'y') arr.push(p);
            return arr.join(sep);
        },

        /**
         *
         *
         */
        setGpsEnabled: function(value) {
            var x = GayGuideApp.cards.settingsCard;

            GayGuideApp.ggv.gps = (value?'home':'off');

            if (x) {
                x.down('#gpsEnabled').setValue(value);

                //
                // if gps is off then turn off directions, too
                //
                if (!value  &&  x.down('#directionsEnabled').getValue()) {
                    x.down('#directionsEnabled').setValue(false);
                }
            }
        },

        setGeoMarker: function(map) {
            var marker = GayGuideApp.ggv.myMarker;

            if (!map) {
                marker && marker.setMap(null)
            }
            else if (GayGuideApp.ggv.gps != 'off') {
                if (!marker) {
                    GayGuideApp.ggv.myMarker = new GeolocationMarker(map, GayGuideApp.ggv.gpsPosition);
                }
                else if (marker.getMap() != map) {
                    marker.setMap(map)
                }
            }
            else if (marker && marker.getMap()) {
                marker.setMap(null)
            }
        },

        /**
         *
         *
         */
        distanceBetweenPoints: function(p1, p2) {
            if (!p1 || !p2 || !p1.lat || !p2.lat) {
                return 0;
            }
            var R = 6371; // Radius of the Earth in km
            var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
            var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        },

        /**
         *
         *
         */
        loc:function(loc) {
            return ggv.distanceBetweenPoints(ggv.gpsPosition, loc);
        },

        /**
         *
         *
         */
        dist2LatLng: function(lat, lng) {
            if (ggv.gps == 'off') {
                return '';
            }
            if ((lat === null) || (lat == 'false') || (lat == false) ) {
                return '<br />';
            }

            var x = ggv.distanceBetweenPoints(ggv.gpsPosition, new google.maps.LatLng(lat, lng));

            if (x == 0) return '<br />';
            return  x.toFixed(1)  + ' km / ' + (x*0.61).toFixed(1) + ' mi';
        },

        ///////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////
        //
        // markers in this map
        //
        //
        //

        markerDirty:           true,
        markerStatus:          {},
        markerCatList:         [
            'favs',
            'bars',
            'rest',
            'shop',
            'hotel',
            'atm',
            'gym',
            'tour',
            'other',
            'desk',
            'org',
            're',
            'event',
            'beach',
            'cafe',
            'spa',
            'art'
        ],
        markerCatListDefaults: ['bars', 'rest'],

        /**
         * clear out markers on map and force reload
         *
         */
        reloadMapMarkers: function() {
            var ggv = GayGuideApp.ggv,
                store = Ext.getStore('mainstore'),
                filterTmp;

            ggv.clearMapMarkers(GayGuideApp.cards.MarkerMap);

            filterTmp = store.getFilters();
            store.clearFilter(true);

            GayGuideApp.ggv.markerDirty = true;
            ggv.doLoadMarkers(GayGuideApp.cards.MarkerMap, store);
            store.setFilters(filterTmp);
        },

        /**
         * Hides all markers (probably needs a new name.  may be not used)
         */
        removeMapMarkers: function() {
            var markermap = GayGuideApp.cards.MarkerMap;

            markermap && markermap.showMarkers([]);
        },

        /**
         * properly destroy previous map markers, mark that we need to reload
         */
        clearMapMarkers: function(map) {
            var markermap = map;

            markermap && markermap.destroyMarkersAll();
            GayGuideApp.ggv.markerDirty = true;
        },

        /**
         * change favs state for a map marker
         *  @param {Number} id The biz id of the marker
         *  @param {Boolean} value True to set favs status, false to unset it.
         */
        setMarkerFavs: function(id, value) {
            var mapCard = GayGuideApp.cards.MarkerMap;

            if (!mapCard) return;

            var x = mapCard.findById(id);

            if (!x) return;

            if (value) {
                if (x.grouplist.indexOf('favs') == -1) {
                    x.grouplist.push('favs');
                }
                if (mapCard._ggv_mapmarkergroups.indexOf('favs') == -1) {
                    mapCard._ggv_mapmarkergroups.push('favs');
                }
            }
            else {
                var i = x.grouplist.indexOf('favs');
                if (i != -1) {
                    x.grouplist.splice(i, 1);
                }
            }
            //mapCard.fireEvent('displayMapMarkers', mapCard);
        },

        /**
         * load map markers with data from the stores
         *
         */
        doLoadMarkers: function(mapCard, store, limit, group) {

            if (!store.getCount() || !mapCard || !(GayGuideApp.ggv.markerDirty || group )) {
                //if (!(GayGuideApp.ggv.markerDirty || group ))console.log('doLoadMarkers BAIL!!!!  markerDirty', GayGuideApp.ggv.markerDirty, group);
                //if (!store.getCount())console.log('doLoadMarkers BAIL!!!!  store.getCount()', store.getCount());
                //if (!mapCard)console.log('doLoadMarkers BAIL!!!!  mapCard', mapCard);
                return;
            }
            
            // make sure infowindow has correct lang text for "more info"
            //
            GayGuideApp.moreinfo =  Ux.locale.Manager.get('buttons.more', 'more info');

            // need a google map to add markers
            //
            if (ggv.googlemaps) {
                GayGuideApp.ggv.markerDirty= false;
                var count = 0,
                x = store.getFilters();

                // cycle thru places markers
                //
                store.clearFilter(true)
                if (limit) {
                    store.each(function (record, index) {
                        if (count < limit) {
                            if (ggv.addmapmarker(mapCard, record.data, true, group))
                                count++;
                        }
                    });
                }
                else {
                    store.each(function (record, index) {
                        ggv.addmapmarker(mapCard, record.data, true);
                    });
                }
                store.setFilters(x);

                // cycle thru atm markers
                //
                if (!limit) {
                    ggv.atmData.each(function(record) {
                        var x = record.data;
                        x['list_cat'] = 'a';
                        x['list_name'] = 'Cashola ATM';
                        x['list_descshort'] = "Cashola ATMs feature the latest high tech security and anti-skimming technologies" +
                        " and are maintained by fully bilingual staff that you can reach if there " +
                        "are any problems. <br /><br />(24 hours local support cel: 322 131 0685)";
                        x['list_cat_page'] ="a";
                        x['list_link'] = "";
                        x['star'] = false;
                        x['id'] = null;
                        ggv.addmapmarker(mapCard, x, false)
                    });
                }  // limit
            } // ggv.googlemaps
        },

        /**
         * format and load a mapmarker and assoc infowindow info into mappanel
         *
         */
        addmapmarker: function (map, data, moreinfo, group) {  ///////// mapPanel
            if (!data.list_latitude || data.list_latitude == '' ) {
                //console.log('addmapmarker skipped');
                return false;
            }


            // format the contents of the infowindow, css doesnt work here???!!!
            //
            var html = ["<div class='ggv-infowindow' style='width: 220px; padding:0; margin: 0; font-size: 13px;'>"];

            html.push( "<span style='white-space: wrap; font-size: 140%; font-family: verdana,sans-serif; font-weight: 700; color: #666666;'>" );
            html.push(data.list_name);
            html.push('<br /></span>');

            html.push('<span style="font-size: 110%; color: #aaaaaa; font-weight: 600;">');

            if (data.list_cat_page == 'Z') {
                html.push( 'Services: ' ); ///// translation problem here!!!
            }
            html.push(data.list_cat_name);
            html.push('<br /></span>');

            if (!moreinfo) {
                html.push(data.list_descshort);
            }
            else {
                if (GayGuideApp.isTablet() && (data.list_addr1 || data.list_addr2  ||  data.list_addr3  ||  data.list_phone)) {
                    html.push('<br />');
                    if (data.list_addr1) { html.push(data.list_addr1);  html.push('<br />'); }
                    if (data.list_addr2) { html.push(data.list_addr2);  html.push('<br />'); }
                    if (data.list_addr3) { html.push(data.list_addr3);  html.push('<br />'); }
                    if (data.list_phone) { html.push(data.list_phone);  html.push('<br />'); }
                    html.push('<br />');
                }
                else {
                    html.push('<br />');
                }
                html.push(   '<button id="more_info_button" class="ggvbutton" name="' +data.id+ '">');
                html.push( GayGuideApp.moreinfo);
                html.push(    '</button>'  );
            }
            html.push( '</div>' );

            // put marker (and infowindow content) into map
            //
            var x = GayGuideApp.ggv.getMapIcons(data);
            map.addMarker({
                id:    data.id,
                lat:   data.list_latitude,
                lng:   data.list_longitude,
                html:  html.join(''),
                icon:  x.iconImage,
                group: group ? [ group ] : (data.fav ? [ x.list, 'favs' ]:[ x.list ])
            });

            return true;
        },

        /**
         * Determine map list and icon based on the data
         *
         */
        getMapIcons: function(data) {
            var iconImage, list, i,
                prefix = "./resources/images/mapicons/",
                postfix = ".png",
                catTable = [
                    {   cat: 'a',  list: 'atm',      icon: 'marker-atm'            },
                    {   cat: 'H',  list: 'hotel',    icon: 'marker2-hotels'        },
                    {   cat: 'N',  list: 'bars',     icon: 'marker2-bars'          },
                    {   cat: 'R',  list: 'rest',     icon: 'marker2-restaurants'   },
                    {   cat: 'S',  list: 'shop',     icon: 'marker2-shops'         },
                    {   cat: 'G',  list: 'art',      icon: 'marker-gallery'        },
                    {   cat: 'O',  list: 'tour',     icon: 'marker2-tours'         },
                    {   cat: 'P',  list: 'tour',     icon: 'marker2-tours'         },
                    {   cat: 'V',  list: 'desk',     icon: 'marker-tourdesk'       },
                    {   cat: 'W',  list: 'desk',     icon: 'marker-tourdesk'       },
                    {   cat: 'C',  list: 'org',      icon: 'marker2-organizations' },
                    {   cat: 'U',  list: 're',       icon: 'marker-re'             },
                    {   cat: 'B',  list: 'event',    icon: 'marker2-events'        },


                    {   cat: 'Q',        list: 'beach', icon: 'marker2-beaches' },
                    {   cat: 'J',        list: 'cafe',  icon: 'marker-coffee'   },
                    {   cat: 'Gyms',     list: 'gym',   icon: 'marker2-gyms'    },
                    {   cat: 'Spas',     list: 'spa',   icon: 'marker-spa'      },

                    {   cat: 'Nbars',    list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Dance',    list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nstrip',   list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nplay',    list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nlounge',  list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nmartini', list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nhotel',   list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nsports',  list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nsports',  list: 'bars',  icon: 'marker2-bars'    },
                    {   cat: 'Nshow',    list: 'bars',  icon: 'marker2-bars'    },


                    {   cat: 'Sdecor',    list: 'shop',  icon: 'marker2-shops'    },
                    {   cat: 'Sclothes',  list: 'shop',  icon: 'marker2-shops'    },
                    {   cat: 'Sjewel',    list: 'shop',  icon: 'marker2-shops'    },
                    {   cat: 'Sfood',     list: 'shop',  icon: 'marker2-shops'    },

                    {   cat: 'Ztattoo',  list: 'other',  icon: 'marker2-other'    }

                ];

            if ('H' == data.list_cat_page)
                return {iconImage: prefix + 'marker2-hotels' + postfix, list: 'hotel' };

            for (i=0; i < catTable.length; i++) {
                if (catTable[i].cat == data.list_cat)
                    return {iconImage: prefix + catTable[i].icon + postfix, list: catTable[i].list };
            }
            return {iconImage: prefix + 'marker-other' + postfix, list: 'other' };
        },

        ///////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////
        //
        // loads placesDetail when selected from infowindow
        //
        //
        //
        moreInfoButtonTap: function(me) {
            document.getElementById('more_info_button').classList.add('ggv-button-active');
            Ext.defer(function() {

                GayGuideApp.cards.MarkerMap.infowindow.close();
                GayGuideApp.ggv.doPlacesItemSelectById(parseInt(me.target.name));
            }, 30, this);
        },

        /**
         *
         *
         */
        doPlacesItemSelectById: function(id) {
            var s = (GayGuideApp.cards.viewport.container.getActiveItem().getItemId() == 'MapContainer') ? 'map' : 'nearby';
            GayGuideApp.app.getApplication().redirectTo(s + '/'+id);
        },

        addCalendarTap: function(me) {
            var name = me.target.name;
            GayGuideApp.ggv.calendarEnabled = true;
            createCookie('calendarAccess', 'on', 0, 300);
            GayGuideApp.ggv.addCalendarEntry(parseInt(name));
        },
        
        addCalendarEntry: function(itemid) {
            var me = this;
            var error = function(message) { alert('Cannot Access Calendar.  Enable access for GayGuideApp in Settings > Privacy > Calendars'); };            
            
            var record = GayGuideApp.store.eventsList.findRecord('id', itemid, 0, false, false, true);
                
            if (!record) {
                alert('no event record found');
                return;
            }

            var args = me.prepareCalendarArgs(record.data);
 
            window.plugins.calendar.findEvent(args.title, args.loc, args.notes, args.startDate, args.endDate, function(message) {
                if (!message.length) {
                    var successFinal = function(message) {
                        window.plugins.calendar.findEvent(args.title, args.loc, args.notes, args.startDate, args.endDate, function(message){
                            if (message.length) {
                                var x = document.getElementById('addCal');    
                                x.innerHTML = "CURRENTLY IN YOUR CALENDAR";
                                x.style.background = "#336";
                                x.style.color = "#fff";
                            }
                            else {
                                //createCookie('calendarAccess', 'off', 0, 300);
                                //GayGuideApp.ggv.calendarEnabled = false;
                            }
                        }, error);
                    };
                    if (GayGuideApp.isAndroid()) {
                        window.plugins.calendar.createEventInteractively(args.title, args.loc, args.notes, args.startDate, args.endDate, successFinal, error);
                    }
                    else {
                        window.plugins.calendar.createEvent(args.title, args.loc, args.notes, args.startDate, args.endDate, successFinal, error);
                    }
                }
            }, error);
        },
        
        chkCalendarEntry: function(record, success, error) {
            var args = this.prepareCalendarArgs(record.data);

            window.plugins.calendar.findEvent(args.title, args.loc, args.notes, args.startDate, args.endDate, function(message) {
                success(!!message.length);
            }, error);
        },
        
        prepareCalendarArgs: function(data) {
            var startDate = new Date(data.timeStringStart);
            var endDate   = new Date(data.timeStringEnd);

            var title = data.nameEvent,
                loc   = data.locationEvent,
                desc  = data.descEvent,
                cat   = data.catnameEvent,
                notes;
                
            if (typeof cat !== 'string' || !cat.length) {
                cat = 'Unknown Category';
            }    
            if (typeof title !== 'string' || !title.length || title == data.list_name) {
                title = cat || 'Some Event';
            }
            
            if (typeof loc !== 'string' || !loc.length) {
                loc = data.list_name || 'Some Where';
            }
            
            if (typeof desc !== 'string' || !desc.length) {
                desc = '';
            }

            title = title.replace(/[^a-zA-Z1-9\.\!\,\:\- ]/g, "");
            loc   = loc.replace(/[^a-zA-Z1-9\.\!\,\:\- ]/g, "");
            cat   = cat.replace(/[^a-zA-Z1-9\.\!\,\:\- ]/g, "");
            desc  = desc.replace(/[^a-zA-Z1-9\.\!\,\:\- ]/g, "");
            notes = cat + ': ' + desc;

            //return [ title, loc, notes, startDate, endDate];
            
            return  {
                title: title,
                loc: loc,
                notes: notes,
                startDate: startDate,
                endDate: endDate
            };
        },

        /**
         * @ private
         *
         * tryRouteReady
         *   tests if route ready and if not asks to be recalled when ready
         *
         */
        tryRouteReady: function(route){
            if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) {
                if (!GayGuideApp.pendingRoute) {
                    GayGuideApp.pendingRoute = route;
                }
                return false;
            }
            return true;
        },

        ///////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////
        //
        //  event clock face stuff
        //
        /**
         *
         */
        timeHrRotation: function(time) {
            var     t = time.split(':'),
                hours = t[0],
                minutes = t[1];

            hours = ((hours > 12) ? hours - 12 : hours);

            return (hours === 12) ? 0 : hourRotate = (hours*30) + (minutes/2);
        },

        /**
         *
         */
        timeMinRotation: function(time) {
            var t = time.split(':'),
                minutes = t[1];

            return (minutes === 0) ? 0 : minRotate = minutes*6;
        },

        /**
         *
         */
        startTimesEvent: function(time) {
            var     t = time.split(':'),
                hours = t[0],
                minutes = t[1],
                amPm = ((hours >= 12) ? ' pm' : ' am');

            hours = ((hours > 12) ? hours - 12 : hours - 0);
            if (hours == 0) hours = 12;

            return hours + ':' + minutes + '<br />' + amPm;
        }
    });

    ggv.mapLat  = parseFloat(readCookie('mapLat')) || 20.6034;
    ggv.mapLong = parseFloat(readCookie('mapLong')) || -105.23370;
    ggv.mapZoom = readCookie('mapZoom') ||  15;
    
    var cookie = readCookie('iconstatus');
    var cookies = cookie ? cookie.split('|') : ggv.markerCatListDefaults;

    ggv.markerCatList.forEach( function(item) {
        if (cookies.indexOf(item) != -1)
            ggv.markerStatus[item] = 'y';
        else
            ggv.markerStatus[item] = 'n';
    });

    return ggv;
}

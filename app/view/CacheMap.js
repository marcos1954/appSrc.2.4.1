/**
 *
 */
Ext.define("GayGuideApp.view.CacheMap", {
    extend: "Ext.Container",
    alias:  'widget.cachemap',
    xtype:  'cachemap',

    constructor : function (config) {
        var me = this;
        me.callParent([config]);
    },
    
    config: {
        debug:                 false,
        
        autoDestroy:           false,
        mapOptions:  {
            zoom:              16,
            center:            new google.maps.LatLng(20.6034, -105.23370),
            mapTypeId:         google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            zoomControl:       true,
            mapTypeControl:    true
        },
        markergroups:          ['bars','hotels'],
        trackLoc:              true,
        layout:                'fit',
        
        cacheXtype:            'gayguidemap',
        cacheClass:            'GayGuideApp.Map',
        cacheLocation:         false,
        cacheDirections:       false,
        cacheIds:              [],
        cacheDisplayMarkers:   false,
        cacheDisplayMarkerGroups: null,
        cacheFitBounds:        false,
        center:                true,
        zoom:                  16,
        noLinkInInfoWindow:    false
    },
    
    initialize: function() {
        this.callParent();
        this.on({
            scope:       this,
            painted:     'cacheMapOnDisplay',
            maprender:   'cacheMapRender'
        });
    },
    
    /**
     *
     *
     */
    cacheMapOnDisplay: function() {
        this.log('cacheMapOnDisplay',this.getId(), arguments);
        var me = this,
            markermap = GayGuideApp.cards.MarkerMap;
        
        if (!markermap) {
            me.cacheMapCreateMap();
        }
        
        me.restore(true);
    },
    
    /**
     *
     *
     */
    restore: function(force) {
        
        this.log('restore','>>> start', this.getId(), this.getItemId(), force);
        var me = this,
            mappanel = me.down('mappanel'),
            markermap = GayGuideApp.cards.MarkerMap;
            
        if (mappanel && (!force && mappanel.getParent() == me)) {
            this.log('restore','>>> ABORT Nothing to restore, or not ready yet!');
            return;
        }
        
        if (!markermap) {
            this.log('restore','>>> ABORT shared map not created yet');
            return;
        }

        var parent = markermap && markermap.getParent();
        
        if (parent != me) {
            this.log('restore','SWAP MAPS');
            if (parent) {
                if (parent.getId() != me.getId()) {
                    //markermap.saveMap(parent.getItemId());
                }
                parent.remove(markermap, false);
            }
            markermap.setTrackLoc(this.getTrackLoc());
            
            GayGuideApp.ggv.directionsDisplay && GayGuideApp.ggv.directionsDisplay.setMap(null); 
            markermap.hideMarkers();
            me.add(markermap);
            
            if (!me.down('markermap').getMap()) {
                this.log('restore','>>> ABORT gmap not ready yet!');
                return;
            }
            google.maps.event.trigger(me.down('markermap').getMap(), 'resize');
        }
        
        Ext.defer(this.doMapRefresh, parent ? 100 :200, this, [me.getItemId()]);
        this.log('restore','>>> end',  this.getId(), this.getItemId());
    },
    
    /**
     *
     *
     */
    doMapRefresh: function(myName) {
        this.log('doMapRefresh','>>> start',  this.getId(), this.getItemId(), myName);
        var me = this,
            markermap = GayGuideApp.cards.MarkerMap,
            ids = me.getCacheIds(),
            boundsdone = false,
            dir = me.getCacheDirections();
            
            
        if (!markermap.isPainted()) {
            this.log('doMapRefresh','ABORT','NOT PAINTED!');
            return;
        }
        
        if (markermap.getParent() != this) {
            this.log('doMapRefresh','map not attached to us');
            return;
        }

        !markermap.getMarkerCount() && GayGuideApp.ggv.reloadMapMarkers();

        var marker =  (ids.length > 0) && ids[0] && markermap.findById(ids[0]),
            destination = marker &&  marker.marker.getPosition();

        me.setMasked(false);
        
        if (dir
         && markermap.getMap()
         && (GayGuideApp.ggv.gps != 'off')
         && GayGuideApp.ggv.gpsPosition
         && ids.length
         && destination) {
            
            // we should have directions; check first if they are ours?
            //
            if (me.directionspending && (me.directionspending) == ids[0]) {
                if (GayGuideApp.ggv.directionsResponse) {
                    markermap.displayDirections(markermap.getMap());
                    boundsdone = true;
                }
            }
            else {
                me.directionspending = ids[0];
                dir && markermap.calcDirections(markermap.getMap(), destination);
            }
        }

        var geoMarkerMap = me.getCacheLocation() ? markermap.getMap() :null;
                                                        
        GayGuideApp.ggv.setGeoMarker(geoMarkerMap);
        
        // markers on this map
        //
        if (me.getCacheDisplayMarkers()) {
            this.log('doMapRefresh','call doDisplayMapMarkers')
            me.up('mainmapview').doDisplayMapMarkers();
        }
        
        var ids = me.getCacheIds();
        if (ids.length) {
            this.log('doMapRefresh','call showMarkerIds')
            if (markermap.showMarkers(null, ids)) {
                
                if (!me.directionspending) {
                    this.log('doMapRefresh','no directions pending; will center');
                    
                    if (me.getCenter()) {
                        if (marker) {
                            markermap.setMapCenter(marker.marker.getPosition());
                        }
                        if (me.getZoom() && markermap.getMap()) {
                            markermap.getMap().setZoom(parseInt(me.getZoom()));
                        }
                    }
                }
                
            }
            else if (!destination) {
                me.setMasked({
                    xtype : 'loadmask',
                    indicator: false,
                    message: Ux.locale.Manager.get("misc.mapnolocation", "no location info")
                });
            }
        }
 
        var moreinfobutton = document.getElementById('more_info_button');
        
        if (moreinfobutton) {
            this.log('doMapRefresh','infowindow found');
            if (me.getNoLinkInInfoWindow()) {
                this.log('doMapRefresh','hiding infowindow');
                moreinfobutton.classList.add('ggv-button-hidden');
            }
            else {
                this.log('doMapRefresh','showing infowindow');
                moreinfobutton.removeClass('ggv-button-hidden');
            }
        }
        
        // center and zoom stuff  / trackLoc saved and restored on this map
        //
        if (me.getTrackLoc()) {
            this.log('doMapRefresh','trackLoc set centering');
            markermap.setMapCenter(new google.maps.LatLng(GayGuideApp.ggv.mapLat, GayGuideApp.ggv.mapLong));
            markermap.getMap().setZoom(parseInt(GayGuideApp.ggv.mapZoom));
        }

        // fit bounds for ids
        //
        if (me.getCacheFitBounds() && !boundsdone) {
            this.log('doMapRefresh','setBoundingBox called');
            markermap.setBoundingBox(null, me.getCacheIds());
        }
        this.log('doMapRefresh','>>> end',  this.getId(), this.getItemId(), myName);
    },

    /**
     * do initialization of the core map once finally rendered
     *
     */
    cacheMapRender: function(map) {
        var cachemap = this;
        
        Ext.defer(function() {
            cachemap.restore(true);
        }, 200, this);
        return false;
    },
    
    /**
     *
     *
     */
    cacheMapCreateMap: function() {
        
        this.log('cacheMapCreateMap');
        var me = this,
            mappanel = me.down('mappanel');
        var markermap = GayGuideApp.cards.MarkerMap;
            
        if (mappanel && (mappanel.getParent() == me)) {
            return;
        }
        
        this.addListener('maprender', this.cacheMapRender, this, { single: true, delay: 100 }, 'after');

        var options = {
            id:          'mapPanel',
            itemId:      'mapPanel',
            cls:         'noSliderToolbar',
            mapOptions:  this.getMapOptions(),
            maskOnSlide: true,
            trackLoc:    this.getTrackLoc()
            
        }
        GayGuideApp.cards.MarkerMap =  Ext.create(me.getCacheClass(), options);
    },

    /**
     *
     *
     */
    destroy: function() {
        
        this.log('destroy', '>>>> start',  this.getId(), this.getItemId());
        
        if (this.getItems().items.length) {
            //GayGuideApp.cards.MarkerMap.saveMap(this.getItemId());
            this.remove(this.down('markermap'), false);
        }
        this.un({
            scope:       this,
            painted:     'cacheMapOnDisplay',
            maprender:   'cacheMapRender'
        });
        
        this.callSuper();
        
        this.log('destroy', '>>>>> end',  this.getId(), this.getItemId());
    },
    
    /**
     *
     *
     */
    applyData: function(data) {
        var me = this,
            id = data.id;

        this.log('applyData', me.getId() , id);
        me.setCacheIds([id]);
    },
    
    /**
     *
     *
     */
    applyCacheIds: function(value) {
        this.log('applyCacheIds', this.getId(), this.getItemId() , value);
        var oldvalue = this._cacheIds;
        this._cacheIds = value;
        
        if (this.getItems() && value && this.getParent() && this.down('map')) {
            if (oldvalue != value) {
                this.directionspending = null;
                GayGuideApp.ggv.directionsDisplay.setMap(null);
            }
            this.log('applyCacheIds', 'CALLING restore', this.getId(), this.getItemId() , value);
            this.restore(true);
        }
        else {
            this.log('applyCacheIds','NOT DONE', this.getId(), this.getItemId() , value);
        }
    },
    
    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.getId())
        if (this.getDebug())
            console.log( args);
    }
});


/**
 * OVERRIDE MAP
 */
Ext.define('GayGuideApp.controller.override.Map', {
    override: 'Ext.Map',

	updateMapOptions: function(newOptions) {
		console.log('updateMapOptions', newOptions);
        var me = this,
            gm = (window.google || {}).maps,
            map = this.getMap();

        if (gm && map) {
			//console.log('zoom to ', newOptions.zoom);
            map.setOptions(newOptions);
        }
        if (newOptions.center && !me.isPainted()) {
            me.un('painted', 'setMapCenter', this);
            me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [newOptions.center] });
        }
    },

	setMapCenter: function(coordinates) {
        var me = this,
            map = me.getMap(),
            gm = (window.google || {}).maps;

        if (gm) {
            if (!me.isPainted()) {
                me.un('painted', 'setMapCenter', this);
                me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [coordinates] });
                return;
            }
            coordinates = coordinates || new gm.LatLng(20.6034, -105.23370); // Puerto Vallarta

            if (coordinates && !(coordinates instanceof gm.LatLng) && 'longitude' in coordinates) {
                coordinates = new gm.LatLng(coordinates.latitude, coordinates.longitude);
            }

            if (!map) {
                me.renderMap();
                map = me.getMap();
            }

            if (map && coordinates instanceof gm.LatLng) {
                map.panTo(coordinates);
            }
            else {
                this.options = Ext.apply(this.getMapOptions(), {
                    center: coordinates
                });
            }
        }
    },

    // @private
    renderMap: function() {
        var me = this,
            gm = (window.google || {}).maps,
            element = me.mapContainer,
            mapOptions = me.getMapOptions(),
            map = me.getMap(),
            event;

        if (gm) {
            if (Ext.os.is.iPad) {
                Ext.merge({
                    navigationControlOptions: {
                        style: gm.NavigationControlStyle.ZOOM_PAN
                    }
                }, mapOptions);
            }

            mapOptions = Ext.merge({
                zoom: 12,
                mapTypeId: gm.MapTypeId.ROADMAP
            }, mapOptions);

            // This is done separately from the above merge so we don't have to instantiate
            // a new LatLng if we don't need to
            if (!mapOptions.hasOwnProperty('center')) {
                mapOptions.center = new gm.LatLng(20.6034, -105.23370); // Puerto Vallarta
            }

            if (element.dom.firstChild) {
                Ext.fly(element.dom.firstChild).destroy();
            }

            if (map) {
                gm.event.clearInstanceListeners(map);
            }

            me.setMap(new gm.Map(element.dom, mapOptions));
            map = me.getMap();

			////
            // Track zoomLevel and mapType changes
			//
            event = gm.event;
            event.addListener(map, 'zoom_changed', Ext.bind(me.onZoomChange, me));
            event.addListener(map, 'maptypeid_changed', Ext.bind(me.onTypeChange, me));
            event.addListener(map, 'center_changed', Ext.bind(me.onCenterChange, me));

			////
			// fix links in google map to not overwrite the app
			// when running as WebView and instead open in some non-destructive way
			//
			if (Ext.browser.is.WebView || Ext.browser.is.Standalone) {
				event.addListenerOnce(map, 'tilesloaded', function() {
					var a = element.dom.getElementsByTagName("a");
			
					for (var i=0; i<a.length; i++) {
						//
						// use Ext.device if we are truely native
						//
						//////if (Ext.device && !Ext.browser.is.Standalone && Ext.browser.is.WebView) {
						//////	a[i].addEventListener("click", function(evt) {
						//////		Ext.device.Device.openURL(this.getAttribute("href"));
						//////		return false;
						//////	});
						//////}
						//
						// disable default action on the link by overwriting onclick w function that
						// returns false to stop the click event from doing its thing
						// effect is to disable the link at this time.  Need to create a Ext panel to put the t/c in
						//
						a[i].onclick=function() {
							return false;
						}
					}
				});
			}

            me.fireEvent('maprender', me, map);
        }
    },
	
	// @private
    destroy: function() {
		console.log('remove basic smap');
        Ext.destroy(this.getGeo());
        var map = this.getMap();

        if (map && (window.google || {}).maps) {
			console.log('clear basic smap listeners');
            google.maps.event.clearInstanceListeners(map);
        }

        this.callParent();
    }
});

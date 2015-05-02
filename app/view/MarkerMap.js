/**
 *
 * Marker conf object
 *  @param {Number}  id
 *  @param {Number}  lat   Latitude for marker
 *  @param {Number}  long  Longitude for marker
 *  @param {String}  html  Marker infowindow content
 *  @param {String}  group grouplist
 *  @param {String}  icon
 *  @param {Boolean} fav
 *
 */
Ext.define("GayGuideApp.view.MarkerMap", {
	extend: "Ext.Map",
	xtype: 'markermap',

	constructor : function (config) {
		var	me = this;

		me._ggv_mapmarkers = [];
		me._ggv_mapmarkergroups = [];

		me.callParent([config]);
		
		me.element.on({
			tap: GayGuideApp.ggv.moreInfoButtonTap,
			delegate: '#more_info_button'
		});
	},

	config: {
        debug: false
    },
	
	/**
	 * show map marker by group
	 *
	 * @param {Object} conf Marker conf object.
	 *
	 */
	showMarkers: function(grouplist, ids) {
		this.log('showMarkers', grouplist, ids);
		var me = this,
			count = 0,
			g = grouplist || [];

		if (Ext.isString(grouplist)) g = [ grouplist ];
		
		me._ggv_mapmarkergroups = g;
		me._ggv_mapmarkers.forEach(function(item, index) {

			var map = item.marker.getMap();
			var commonValues = item.grouplist.filter(function(value) {
				return g.indexOf(value) > -1;
			});
			
			
			if (ids && ids.length) {
				if ((!grouplist || commonValues.length)  &&  (ids.indexOf(item.id ) != -1)) {
					if (map != me.getMap()) {
						item.marker.setMap(me.getMap());
						count++;
					}
				}
				else if (map) {
					item.marker.setMap(null);
				}
			}
			else {
				if (commonValues.length) {
					if (map != me.getMap()) {
						item.marker.setMap(me.getMap());
						count++;
					}
				}
				else {
					item.marker.setMap(null);
				}
			}
		});
		return count;
	},

	
	/**
	 *
	 */	
	hideMarkers: function(grouplist, ids) {
		var me = this,
			markers = me._ggv_mapmarkers,
			g = grouplist;
			
		this.log('hideMarkers', grouplist, ids);
		if (!g) g=me.getMarkerGroups();
			
		markers.forEach(function(item, index) {
			
			if (grouplist) {
				var commonValues = item.grouplist.filter(function(value) {
					return g.indexOf(value) > -1;
				});

				if (!commonValues.length) return;
			}
			
			if (ids && (ids.indexOf(item.id) == -1)) return;

			item.marker.setMap(null);
		});
	},

	/**
	 *
	 */
	animateMarker: function(id, anim, duration){		
		this._ggv_mapmarkers.forEach(function(item, index) {
			if (item.id == id) {
				var marker = item.marker;
				
				marker.setAnimation(anim);
				Ext.defer(function(){
					marker.setAnimation(null);
				}, duration?duration:1200, this)
			}
		});
	},
	
	/**
	 * adds an infowindow marker
	 *
	 * @param {Object} conf Marker conf object.
	 *
	 */
	addMarker: function(conf) {
		var	me = this,
			marker = new google.maps.Marker();

		if (!conf.lat || !conf.lng ) {
			this.log('addMarker','cannot create marker with no latlng', conf);
			return null;
		}
			
		marker.setPosition(new google.maps.LatLng(conf.lat, conf.lng));
		marker.setIcon(conf.icon);

		me.infowindow = me.infowindow || new google.maps.InfoWindow({ maxWidth:220 })

		//
		// intentional closure here
		//
		google.maps.event.addListener(marker, 'mouseup', (function(marker) {
			return function() {
				var html = conf.html;
				me.infowindow.setContent(conf.html);
				me.infowindow.open(me.getMap(), marker);
				

				google.maps.event.addListenerOnce(me.infowindow, 'domready', function() {
					var moreinfobutton = document.getElementById('more_info_button');
					if (moreinfobutton) {
						if (me.getParent().getNoLinkInInfoWindow())
							moreinfobutton.classList.add('ggv-button-hidden');
						else
							moreinfobutton.removeClass('ggv-button-hidden');
					}
				});
			}
		})(marker));

		var mco = {
			id:        conf.id,
			marker:    marker,
			grouplist: conf.group
		};

		me._ggv_mapmarkers.push(mco);
		return mco;
	},

	/**
	 * @param {Number/Object[]} marker Marker to be destroyed
	 * 
	 */
	destroyMarkers: function(marker) {
		var	me = this;
		this.log('destroyMarkers', marker);

		if (Ext.isNumber(marker)) {
			me.destroyMarker(me.findById(marker));
		}
		else if (Ext.isArray(marker)) {
			marker.forEach(function(item, index) {
				me.destroyMarker(item);
			});
		}
	},

	/**
	 * destroys all markers and groups
	 *
	 */
	destroyMarkersAll: function() {
		this.log('destroyMarkersAll');
		var	me = this,
			j = me._ggv_mapmarkers;

		while(me._ggv_mapmarkers.length )
			me.destroyMarker(me._ggv_mapmarkers[0]);

		me._ggv_mapmarkergroups = [];
	},
	
	/**
	 * destroys all in a group
	 *
	 */
	destroyMarkerGroup: function(grouplist) {
		this.log('destroyMarkerGroup', grouplist);
		var me = this,
			g = grouplist;
		
		if (Ext.isString(grouplist))
            g = [ grouplist ];

		var	me = this,
			j = me._ggv_mapmarkers;

		for (var i = me._ggv_mapmarkers.length-1; i >= 0; i-- ) {
			if (me._ggv_mapmarkers[i].grouplist.indexOf(g[0]) != -1) {
				me.destroyMarker(me._ggv_mapmarkers[i]);
			}
		}	
		me._ggv_mapmarkergroups = [];
	},

	/**
	 * @param {Object} marker Marker Control Object
	 */
	destroyMarker: function(marker) {
		var me = this,
			i = me._ggv_mapmarkers.indexOf(marker);
            
        this.log('destroyMarker', marker);

		if (i != -1) {
			marker.marker.setMap(null);
			google.maps.event.clearInstanceListeners(marker.marker);
			if (me._ggv_mapmarkers.length > 1)
				me._ggv_mapmarkers.splice(i, 1);
			else
				me._ggv_mapmarkers = [];
		}
	},

	/**
	 *
	 */
	setBoundingBox: function(grouplist, ids, noLocation) {
		this.log('setBoundingBox', grouplist, ids);
		var me = this,
			idArray = ids,
			g = grouplist,
			counter=0;

		if (Ext.isString(grouplist)) g = [ grouplist ];
		if (Ext.isNumber(ids)) idArray = [ ids ];
		
		var bounds = new google.maps.LatLngBounds();
		if (!noLocation && GayGuideApp.ggv.gpsPosition) {
			bounds.extend(GayGuideApp.ggv.gpsPosition);
		}
		
		me._ggv_mapmarkers.forEach(function(item, index) {
			if (g) {
				var commonValues = item.grouplist.filter(function(value) {
					return g.indexOf(value) > -1;
				});
				if (!commonValues.length)
                    return;
			}
			if (idArray) {
				if (idArray.indexOf(item.id) == -1)
					return;
			}
			counter++;
			if (item.marker.getPosition())
                bounds.extend(item.marker.getPosition());
		});
		counter && me.getMap() && me.isPainted() && me.getMap().fitBounds(bounds);
	},
	
	/**
	 * @param {Number} id Biz id of the marker
	 */
	findById: function(id) {
		var me = this,
			i;
		this.log('displayDirections','setting map in directions display object');	
		for (i=0; i<me._ggv_mapmarkers.length; i++) {
			if (me._ggv_mapmarkers[i].id == id) {
				return me._ggv_mapmarkers[i];
			}
		}
		return null;
	},
	
	getMarkerCount: function() {
		return this._ggv_mapmarkers.length;
	},
    
    		
	/**
	 *
	 */	
	getMarkerGroups: function() {
		return this._ggv_mapmarkergroups;
	},

	/**
	 * Send a route request for the directions
	 *
	 *  @param {google.map} map The google map instance
	 */
	calcDirections: function(map, to, from) {
		var destination = to || GayGuideApp.ggv.loc,
			origin = from || GayGuideApp.ggv.gpsPosition;
			
		this.log('calcDirections','calling route request');
			
		GayGuideApp.ggv.directionsResponse = null;
		try { GayGuideApp.ggv.directionsDisplay.setMap(null); } catch(err) {};
		
		if ((GayGuideApp.ggv.directions == 'on')
		  && destination
		  && origin
		  && !destination.equals(origin)
		  && map)  {
			
			var	request = {
				origin:      origin,
				destination: destination,
				travelMode:  'WALKING'
			};

			GayGuideApp.ggv.directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					GayGuideApp.ggv.directionsResponse = response;
					if ((GayGuideApp.cards.MarkerMap.getParent().getItemId() == 'detailMap')) {
						GayGuideApp.cards.MarkerMap.displayDirections(map);
					}
				}
				else {
					console.log('calcDirections','directionsService.route error');
				}
			});
		}
	},

	/**
	 * Display the directions previously requested and received on a map
	 *
	 *  @param {google.map} map The google map instance
	 */
	displayDirections: function(map) {
		var m = map || this;

		if (GayGuideApp.ggv.directionsResponse) {
			this.log('displayDirections','setting map in directions display object');
			GayGuideApp.ggv.directionsDisplay.setMap(m);
			this.log('displayDirections','displaying directions');
			GayGuideApp.ggv.directionsDisplay.setDirections(GayGuideApp.ggv.directionsResponse);
		}
	},
	
	log: function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift('MarkerMap')
		if (this.getDebug())
			console.log( args);
	}
});

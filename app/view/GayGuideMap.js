/**
 *
 */
Ext.define("GayGuideApp.view.GayGuideMap", {
	extend: "GayGuideApp.view.MarkerMap",
	alias: 'widget.mappanel',
	
	xtype: 'gayguidemap',
	
	alternateClassName: ['GayGuideApp.Map'],

	//requires: ['Ext.device.Device'],

	constructor : function (config) {
		var 	me = this;

		me.callParent([config]);	
	},

	config: {
		id:          'mapPanel',
		layout:      'fit',
		cls:         'ggv-map-google',
		maskOnSlide: true,
		mapMarkers:  [],
		mapStateInfo: {},
		trackLoc:     true,
		bubbleEvents: 'maprender',

		listeners: {
			initialize: function(me) {
				if (GayGuideApp.isTablet()) {
					for(var index in me.panZoomLocs) {
						me.panZoomLocs[index].zoom++;
					}
				}
			},

			centerchange: Ext.Function.createBuffered(function(panel, map, loc) {
				if (panel.getTrackLoc()) {
					GayGuideApp.ggv.mapcenter = loc;
					GayGuideApp.ggv.mapLat = loc.lat();
					GayGuideApp.ggv.mapLong = loc.lng();
	
					createCookie('mapLat',  GayGuideApp.ggv.mapLat, 0, 30);
					createCookie('mapLong', GayGuideApp.ggv.mapLong, 0, 30);
				}
			}, 500, this),

			typechange: Ext.Function.createBuffered(function(panel, map, type) {
				if (panel.getTrackLoc()) {
					GayGuideApp.ggv.mapType = type;
					createCookie('mapType', GayGuideApp.ggv.mapType, 0, 30);
				}
			}, 500, this),

			zoomchange: Ext.Function.createBuffered(function(panel, map, zoom) {
				if (panel.getTrackLoc()) {
					GayGuideApp.ggv.mapZoom = parseInt(zoom);
					createCookie('mapZoom', GayGuideApp.ggv.mapZoom, 0, 30);
				}
			}, 500, this)
		}
	},

	/**
	 * named locations used by the app in the main map view
	 *
	 */
	panZoomLocs: [{
		name:       'PVR',
		latitude:   20.6400,
		longitude:  -105.24000,
		zoom:       12
	},{
		name:       'GayPVR',
		latitude:   20.6034,
		longitude:  -105.2337,
		zoom:       15
	},{
		name:       'OlasAltas',
		latitude:   20.6003,
		longitude:  -105.2375,
		zoom:       17
	},{
		name:       'Cardenas',
		latitude:   20.6038,
		longitude:  -105.23488,
		zoom:       17
	}],

	/**
	 * pan and zomm to "named" location
	 *
	 */
	panZoom: function(a) {
		var	map = this.getMap();

		this.panZoomLocs.forEach(function(item) {
			if (item.name === a) {
				var 	zoom = item.zoom,
					loc = item;

				map.panTo(new google.maps.LatLng(loc.latitude, loc.longitude));
				map.setZoom(zoom);
			}
		});
	},
	
	/**
	 * puts current state info for this map in
	 *
	 */
	saveMap: function(name) {
		
		console.log('saveMap', name);
		var mapStateInfo = this.getMapStateInfo();
		var state = {};
		var map = this.getMap();
		if (!map) return false;
		
		state.parent = this.getParent().getId();
		state.markergroups = this.getMarkerGroups();
		
		state.center = map.getCenter();
		state.heading = map.getHeading();
		state.mapType = map.getMapTypeId();
		state.projection = map.getProjection();
		state.streetView = map.getStreetView();
		state.tilt = map.getTilt();
		state.zoom = map.getZoom();

		mapStateInfo[name] = state;
		
		this.setMapStateInfo(mapStateInfo);
		return true;
	},
	
	/**
	 * puts current state info for this map in
	 *
	 */
	restoreMap: function(name) {
		return;
		var mapStateInfo = this.getMapStateInfo(),
			state = mapStateInfo[name],
			map = this.getMap();
			
		if (!state) return;
		
		this.setMapCenter(state.center);
		map.setHeading(state.heading);
		map.setMapTypeId(state.mapType);
		//map.setProjection(state.projection);
		map.setStreetView(state.streetView);
		map.setTilt(state.tilt);
		map.setZoom(state.zoom);
		
		this.showMarkers(state.markergroups);
	}
});

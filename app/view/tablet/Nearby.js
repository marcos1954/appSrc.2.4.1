/**
 *
 */
Ext.define("GayGuideApp.view.tablet.Nearby", {
	//extend: "GayGuideApp.view.ContainerLite",
	extend: "Ext.Container",
	xtype: 'nearbylisttablet',

	config: {
		
		layout:     'fit',
		id:         'nearList',
		
		items: [{
			docked: 'top',
			xtype:  'statusbar'
		},{
			docked: 'top',
			xtype:  'toolbar',
			cls:    'sliderToolbar',
			itemId: 'placesListToolbar',
			title:  'Near Me Now',

			defaults: {
				xtype:         'button',
				iconMask:      true,
				ui:            'light'
			},

			items: [{
				iconCls:       'list',
				name:          'slidebutton',
				itemId:        'nearNav'
			},{
				itemId:        'placesListBackButton',
				ui:            'back',
				hidden:	       true,
				enableLocale:  true,
				locales:       { text : 'nav.button.back2main' }
			},{
				xtype: 'spacer'
			},{
				id:         	'nearbyGpsButton',
				iconCls:        'locate1',
				iconMask:       true,
				ui:             'plain'

			}]
		},{
			xtype: 'container',
			layout: 'hbox',
			items: [{
				xtype:                 'nearbylist',
				
				store:                 null,
				infinite:              true,
				
				useSimpleItems:        true,
				variableHeights:       true,
				refreshHeightOnUpdate: false,
				
				onItemDisclosure:      true,
				allowDeselect:         true,
				disableSelection:      false,
				
				scrollToTopOnRefresh:  false,
				scrollable:            true,
				pinHeaders:            false,
				grouped :              false,
				
				itemHeight:            70,
				ui:                    'round',
				mode:                  'MULTI',
				flex:                  1,
				
				listeners: {
					selectionchange: function(me, records, eOpts) {
						var card = me.up('#nearList'),
							ids = [];
						
						me.getSelection().forEach(function(item, index) {
							ids.push(item.data.id);
						});
						card.down('#nearMapPanel').showMarkers('near', ids);
					}
				}
			},{
				xtype: 		           'markermap',
				id:                    'nearMapPanel',
				layout:                'fit',
				cls:                   'ggv-map-google noSliderToolbar',
				maskOnSlide:           true,
				mapMarkers:            [],
				flex:                  2,
				
				listeners: {
					initialize: function(me) {
						me.on('maprender', function(smap) {
							var	me     = this,
								map    = smap.getMap(),
								marker = GayGuideApp.ggv.myMarker;

							me.setMapOptions({
								zoom:              parseInt(GayGuideApp.ggv.mapZoom),
								center:            new google.maps.LatLng(GayGuideApp.ggv.mapLat, GayGuideApp.ggv.mapLong),
								mapTypeId:         google.maps.MapTypeId.ROADMAP,
								streetViewControl: false,
								zoomControl:       true,
								mapTypeControl:    GayGuideApp.isTablet()
							});
		
							GayGuideApp.ggv.setGeoMarker(map);

							if (map) {
								Ext.defer(function() { 
									me.up('#nearList').refresh();
								}, 700, this);
							}
						}, this, {delay:1, single: true});
					},
					
					painted: function() {
						var	me = this,
							map = me.getMap(),
							marker = GayGuideApp.ggv.myMarker;
						
						if (!map) return;

						GayGuideApp.ggv.setGeoMarker(map);

						Ext.defer(function() {
							me.up('#nearList').refresh();
						}, 700, this);
					}
				}
			}]
		}],

		listeners: {
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			},

			show: function(me) {
				var w = Ext.Viewport.getWindowWidth(),
					h = Ext.Viewport.getWindowHeight();

				me.adjustSize(me, w, h);
			}
		}
	},

	adjustSize: function(me, w, h) {

		if (!me.isPainted()) return;

		me.restoreItems(me);

		//if (h < GayGuideApp.narrowLimit) {
		//	me.down('#topImage').hide();
		//}
		//else {
		//	me.down('#topImage').show();
		//}

		if (w < GayGuideApp.narrowLimit) {
			me.setCls('narrow');
		}
		else {
			me.removeCls('narrow');
		}
	},

	restoreItems: function(me) {
		if (me._optimizedItems) me.onActivate(me);
	},
	
	refresh: function() {
		//console.log('refresh', this);
		var a = this.onActivate(this);
		var map = this.down('markermap'),
			list = this.down('list'),
			store = list.getStore(),
			i = 15,	y, ids = [];
		
		this.scrollToTop(this);
		store.sort();
		
		y = store.getRange(i-1,i);
		
		list.getSelection().forEach(function(item, index) {
			ids.push(item.data.id);
		});

		list.deselect(y, true);
		list.refresh();
		
		//////////////////////////////
		//
		// filter everything farther in than the 15th item in the sorted list
		//
		if (GayGuideApp.ggv.gpsPosition && y.length && y[0]) {
			//
			var c = new google.maps.LatLng(y[0].data.list_latitude, y[0].data.list_longitude),
				max = GayGuideApp.ggv.distanceBetweenPoints(c, GayGuideApp.ggv.gpsPosition);

			this.down('list').getStore().setFilters({
				filterFn: function(item) {
					var a = GayGuideApp.ggv.gpsPosition,
						b = new google.maps.LatLng(item.data.list_latitude, item.data.list_longitude);
						
					return ( GayGuideApp.ggv.distanceBetweenPoints(a,b) < max );
				}
			});
		}
		//
		//
		/////////////////////////////	
					
		map.destroyAll();
        GayGuideApp.ggv.doLoadMarkers(map, store, i, 'near');
		
		if (ids == []) {
			map.showMarkers(['near']);
		}
		else {
			map.showMarkers(['near'], ids);
		}
		map.setBoundingBox(['near']);
		if (a) this.onDeactivate(this);
	},

	scrollToTop: function(me) {
		var s = me.down('list').getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});

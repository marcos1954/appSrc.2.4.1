/**
 *
 */
Ext.define("GayGuideApp.view.PlacesList", {
	//extend: "GayGuideApp.view.ListLite",
	extend: "Ext.dataview.List",
	xtype: 'placeslist',

	config: {
		id:                 'placesList',
		cls:                'ggv-places-list',
		layout: 			'fit',
		grouped :           true,
		scrollable:         true,
		allowDeselect:      true,
		store:              null,
		variableHeights:    false,
		infinite:           true,
		scrollToTopOnRefresh:false,
		useSimpleItems:     true,
		onItemDisclosure:   true,
		disableSelection:   true,
		itemHeight:         60,

		itemTpl: [
		'<div class="ggv-pl-item<tpl if="fav == 1"> favorite</tpl><tpl if="notes"> notes</tpl>" >',
		 '<div class="ggv-fav-star" >5</div>',
		 '<div class="ggv-fav-note" >(</div>',
		 '<div class="ggv-item-inner">',
		  '<span class="ggv-places-list-name" >{[ Ext.util.Format.ellipsis(values.list_name, 24 - Math.floor((GayGuideApp.txtSz-19 )*1.8)) ]}</span>',
		  '<br />',
		  '<span class="ggv-places-list-loc" >',
		   '{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}',
		  '</span>',
		 '</div>',
		'</div>'
		]
	},

	restoreItems: function(me) {
		if (me._optimizedItems) me.onActivate(me);
	},

	scrollToTop: function(me) {
		var 	s = me.getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});

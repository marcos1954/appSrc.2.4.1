/**
 *
 */
Ext.define("GayGuideApp.view.Nearby", {
	extend: "Ext.List",
	xtype: 'nearbylist',

	config: {
		id:                 'nearListSimple',
		cls:                'ggv-places-list',
		layout: 			'fit',
		grouped :           false,
		scrollable:         true,
		allowDeselect:      true,
		variableHeights:    false,
		infinite:           true,
		useSimpleItems:     true,
		onItemDisclosure:   true,
		disableSelection:   false,
		itemHeight:         75,

		itemTpl: [
		'<div class="ggv-list-name">',
		  '{[ Ext.util.Format.ellipsis(values.list_name, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8)) ]}',
		'</div>',
		'<div class="ggv-category-name">',
		  '{[  Ext.util.Format.ellipsis(values.list_cat_name, 40) ]}',
		'</div>',
		'<div class="ggv-category-name">',
		 '{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}',
		'</div>'
		]
	},

	scrollToTop: function(me) {
		me.getScrollable().getScroller().scrollToTop();
	}
});

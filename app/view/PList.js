/**
 *
 */
Ext.define("GayGuideApp.view.PList", {
	//extend: "Ext.List",
	extend: "GayGuideApp.view.ListLite",
	
				
	xtype: 'plist',

	config: {
		itemId:             'pList',
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
		itemHeight:         60,

		itemTpl: [
		'<div class="ggv-list-name">',
			'{[ Ext.util.Format.ellipsis(values.list_name, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8)) ]}',
		'</div>',
		'<div class="ggv-category-name">',
			'{[  Ext.util.Format.ellipsis(values.list_cat_name, 40) ]}',
		'</div>'
		]
	},

	scrollToTop: function(me) {
		me.getScrollable().getScroller().scrollToTop();
	}
});

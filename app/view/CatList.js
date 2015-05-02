/**
 *
 */
Ext.define("GayGuideApp.view.CatList", {
	extend: 'GayGuideApp.view.ListLite',
	//extend: 'Ext.dataview.List',
	xtype: 'catlist',

	config: {
		layout: 			'fit',
		scrollable:         true,
		allowDeselect:      true,
		store:              null,
		variableHeights:    false,
		infinite:           true,
		useSimpleItems:     true,
		onItemDisclosure:   true,
		disableSelection:   false,
		itemHeight:         60,

		
		itemTpl: [
		'{[ Ext.util.Format.ellipsis(values.catname, 25 - Math.floor((GayGuideApp.txtSz-20 )*1.8))  ]}'
		]
	},


	scrollToTop: function(me) {
		var 	s = me.getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});

/**
 *
 */
Ext.define("GayGuideApp.view.TagList", {
	//extend: 'Ext.dataview.List',
	extend: 'GayGuideApp.view.ListLite',
	xtype: 'taglist',

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
			'{[ Ext.util.Format.ellipsis(values.name, 25 - Math.floor((GayGuideApp.txtSz-20 )*1.8))  ]}',
			'  <span style="color: #aaa; font-size: 80%; font-style: italic;">{tagcount}</span> '		
		]
	},

	scrollToTop: function(me) {
		var s = me.getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});
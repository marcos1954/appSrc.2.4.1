/**
 *
 */
Ext.define("GayGuideApp.view.PlacesMenu", {
	//extend: "GayGuideApp.view.ListLite",
	extend: "Ext.List",
	
	xtype: 'placesmenu',

	config: {
		id:               'placesMenu',
		cls:              'ggv-places-menu',
		layout:           'fit',
		xtype:            'list',
		store:            'menu',
		enableLocale:     true,
		onItemDisclosure: true,
		disableSelection: true,
		ui: 'round',

		itemTpl: [
			'<div style="width: 60px; float: left; padding-right: 10px;">',
				'<tpl if="base64 == null" >',
					'<img width50  src="./resources/images/{menuIcon}" style="opacity:0.4;" />',
				'<tpl else>',
					'<img width=50 alt="" src="data:image/png;base64,{base64}"  style="opacity:0.4;" />',
				'</tpl>',
			'</div>',

			'<div style="margin-left: 72px;" >',
				'<span class="ggv-menu-places-name" >{menuName}</span>',
				'<br />',
				'<span class="ggv-menu-places-aux" >{menuAuxText}</span>',
			'</div>',
			'<br clear="all" />'
		]
	},
	
	
	scrollToTop: function(me) {
		var 	s = me.getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});

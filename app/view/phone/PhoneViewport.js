/**
 *
 */
Ext.define("GayGuideApp.view.phone.PhoneViewport", {
	extend: 'Ext.Panel',

	config: {
		id:         'mainphoneviewport',
		fullscreen: true,
		layout:     'vbox',

		items: [{
			id:     'mainStatusBar',
			docked: 'top',
			xtype:  'phonestatusbar'
		},{
			id:    'phonemainview',
			xtype: 'phonemainview'
		}],

		listeners: {
			resize: function(me) {
				var i = Ext.Viewport.element.dom.offsetHeight;
				Ext.Viewport.query('#phonemainview')[0].setHeight(i-17);
			}
		}
	}
});

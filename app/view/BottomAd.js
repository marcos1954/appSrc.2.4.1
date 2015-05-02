/**
 *
 */
Ext.define("GayGuideApp.view.BottomAd", {
	extend:   "Ext.Sheet",
	xtype:    'bottomad',

	config:	{
		cls:          'ggv-bottom-ad',
		id:           'bottomAd',
		hidden:       true,

		centered:     false,
		modal:        false,
		bottom:       '0',
		height:       130,
		zIndex:       20,
		stretchX:     true,

		html:         '<div style="float: left; width: 80px;" ><img src="http://www.gayguidevallarta.com/Listings/Images/encuentroslogo.gif" width="70" height=auto" /></div><strong>Encuentros</strong> Special tonight is Venetian pizza or pasta. 50 pesos!',

		showAnimation: { type: 'slideIn',  duration: 1000 , direction: 'up'   },
		hideAnimation: { type: 'slideOut', duration: 250  , direction: 'down' },

		listeners: {
			initialize: function() {
				this.element.on({
					tap: function(me) {
						this.fireEvent('tap', this, this)
					},
					scope: this
				});
			}
		}
	}
});

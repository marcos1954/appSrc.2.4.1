/**
 *
 */
Ext.define("GayGuideApp.view.phone.PlacesListPhone", {
	extend: "Ext.Container",
	xtype: 'placeslistphone',
	alias: 'widget.placeslistcard',

	config: {
		itemId: 'placesList',
		layout: 'fit',

		items: [{
			itemId:          'placesListToolbar',
			docked:          'top',
			xtype:           'toolbar',
			cls:             'sliderToolbar',

			items: [{
				xtype:        'button',
				iconMask:     true,
				iconCls:      'list',
				name:         'slidebutton'
			},{
				itemId:       'placesListBackButton',
				hidden:       true,
                iconCls:    'arrow_left'
			},{
				xtype:        'spacer'
			},{
				itemId:       'placesFavsOnlyButton',
				xtype:        'button',
				iconMask:     true,
				ui:           'plain',
				iconCls:      'star'
			}]
		},{
			xtype: 'placeslist',
			ui: 'round',
			variableHeights:       true,
			refreshHeightOnUpdate: true,
			listeners: {
				initialize: function(me) {
					me.setPinHeaders(true);
				}
			}
		}]
	},
    
    
    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            active = mc.down('#placesListCard');

        if (active) {
            var position = active.down('list').getScrollable().getScroller().position.y;
            var selection = active.down('list').getSelection()[0];
            var index = selection && active.down('list').getStore().indexOf(selection);
            var state = {
                position: position,
                selectindex: index
            };
            return state;
        }
        return null;
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

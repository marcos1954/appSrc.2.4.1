/**
 *
 */
Ext.define("GayGuideApp.view.phone.CatListPhone", {
	extend:   "Ext.Container",
	requires: ['Ext.Img'],
	xtype:    'catlistphone',
    
    config: {
		id:         'catList',
		layout:      'card',
        
        items: [{
			docked: 'top',
			xtype:  'titlebar',
			cls:    'sliderToolbar',
			itemId: 'placesListToolbar',
            enableLocale: true,
			locales : { title : 'navlist.title.catList'},

			defaults: {
				xtype:         'button',
				iconMask:      true,
				ui:            'light'
			},

			items: [{
				iconCls:       'list',
				name:          'slidebutton'
			}]
        },{
            layout: 'hbox',
            xtype: 'container',
            items: [{
				xtype: 'catlist',
				id:    'catListPhone',
				store: 'catListStore',
				ui: 'round',

				flex:  1,
				disableSelection: true,
				itemTpl: [
					'<tpl if="!catpage || catcode == catpage"><div style="font-weight: 700; color: #333"><tpl else><div style="font-size: 90%; padding-left: 12px;"></tpl>',
					'{[ Ext.util.Format.ellipsis(values.catname, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8))  ]}',
					'</div>'
				]
            }]
        }]
    },

    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            active = mc.child('catlistphone');

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
	
	scrollToTop: function(me) {
		var a = me.down('catlist');
		a.deselectAll(true);
		a.scrollToTop(a)
	}
});

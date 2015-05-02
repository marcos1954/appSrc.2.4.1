/**
 *
 */
Ext.define("GayGuideApp.view.tablet.PlacesListTablet", {
	extend: "Ext.Container",
	xtype: 'placeslisttablet',
	alias: 'widget.placeslistcard',

	config: {
		layout:     'fit',
		itemId: 'placesList',
		
		items: [{
			docked: 'top',
			xtype:  'statusbar'
		},{
			docked: 'top',
			xtype:  'toolbar',
			cls:    'sliderToolbar',
			itemId: 'placesListToolbar',

			defaults: {
				xtype:         'button',
                ui:            'plain'
			},

			items: [{
				iconCls:       'list',
				name:          'slidebutton'
			},{
				itemId:        'placesListBackButton',
				hidden:	       true,
                iconCls:       'arrow_left'
			},{
				xtype: 'spacer'
			},{
				itemId:        'cuisineButton',
				text:          'Choose Cuisines',
				ui:            'dark',
				hidden:        true
			},{
				itemId:         'placesFavsOnlyButton',
				iconCls:        'star'
			}]
		},{
			xtype:                 'placeslist',
			store:                 null,
			layout:                'fit',
			grouped :              true,
			scrollable:            true,
			allowDeselect:         true,
			infinite:              true,
			useSimpleItems:        true,
			variableHeights:       false,
			itemHeight:            150,
			refreshHeightOnUpdate: false,
			onItemDisclosure:      true,
			disableSelection:      true,
			scrollToTopOnRefresh:  false,
			pinHeaders:            true,
			ui:                    'round',

			listeners: {
				initialize: function(me) {
					me.setPinHeaders(true);
				}
				
			},

			itemTpl: [
				'<div style="margin-bottom: 10px; width: 100%;">',
				 '<div class="ggv-pl-logo">',
                    '<img width="{list_width}" height="{list_height}" src="',
                        '<tpl if="list_src">',
                            'http://www.gayguidevallarta.com',
                            '{list_src}',
                        '</tpl>',
                    '" />',
                 '</div>',
	
				 '<div class="ggv-pl-name">',
				  '<span class="name" >{list_name}</span>',
				  '<br />',
	
				  '{% if (! GayGuideApp.cards.placesList._ggv_hideCategoryText) {  %}',
				   '<span class="cat">{list_cat_name}</span>',
				   '<br />',
				   '{% } %}',
	
				  '<tpl if="list_tags">',
				   '<p style="font-size:80%;color: #655;">{list_tags}</p>',
				  '</tpl>',
	
				  '<span class="loc" >{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}</span>',
				 '</div>',
	
				 '<div class="ggv-pl-star">',
				  '<tpl if="fav == 1">',
				   '<img src="http://www.gayguidevallarta.com/images/star.png" />',
				  '</tpl>',
				 '</div>',
	
				 '<div class="ggv-pl-desc">',
				  '<tpl if="GayGuideApp.ggv.notes == \'on\' && notes">',
				   '<div style="color: #10a; margin-bottom: 30px; font-family: \'Verdana-Italic\', sans !important;">',
					'{notes}',
					'<br />',
				   '</div>',
				  '</tpl>',
				  '{list_descshort}',
				 '</div>',
				 '<br  clear="all" />',
				'</div>',
				'<br  clear="left" />&nbsp;<br />'
			]
		}],

		listeners: {
			favschanged: function(me) {
				me.refresh();
			},
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			},

			show: function(me) {
				var w = Ext.Viewport.getWindowWidth(),
					h = Ext.Viewport.getWindowHeight();

				me.adjustSize(me, w, h);
			}
		}
	},

	adjustSize: function(me, w, h) {

		if (!me.isPainted()) return;

		//me.restoreItems(me);

		//if (h < GayGuideApp.narrowLimit) {
		//	me.down('#topImage').hide();
		//}
		//else {
		//	me.down('#topImage').show();
		//}

		if (w < GayGuideApp.narrowLimit) {
			me.setCls('narrow');
		}
		else {
			me.removeCls('narrow');
		}
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
		var s = me.down('list').getScrollable().getScroller();

		s.scrollTo(0,1);
		s.scrollTo(0,0);
	}
});

/**
 *
 */
Ext.define('GayGuideApp.view.tablet.FavsList', {
	extend: 'Ext.dataview.List',
	xtype:  'favslisttablet',
	alias: 'widget.favslist',

	config: {
		itemId:                'favsList',
		store:                 null,
		cls:                   'ggv-places-list',
		grouped:               false,
		deferEmptyText:        false,
		layout:                'fit',
		variableHeights:       true,
		refreshHeightOnUpdate: true,
		onItemDisclosure:      true,
		disableSelection:      true,
		itemHeight:            130,
		ui: 'round',

		itemTpl:  [
			'<div >',
			
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
					'<span class="cat">{list_cat_name}</span><br />',
					'<span class="loc" >{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}</span>',
				'</div>',

				'<div class="ggv-pl-star">',,
					'<img src="http://www.gayguidevallarta.com/images/star.png"/>',
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
			'</div>',
			'<br clear=all />'
		],

		items: [{
			docked:         'top',
			xtype:          'statusbar'
		},{
			xtype:          'titlebar',
			cls:            'sliderToolbar',
			enableLocale:    true,
			locales:         { title : 'misc.favorites' },
			docked:          'top',
			items: [{
				xtype:   'button',
				iconMask: true,
				iconCls: 'list',
				ui:      'plain',
				name:    'slidebutton'
			}]
		}],

		listeners: {
			favschanged: function(me) {
				me.refresh();
			},
			langchanged: function(me, newlang, oldlang) {
				me.setLang(me, newlang, oldlang);
				me.refresh();
			},
			initialize: function(me) {
				var 	w = Ext.Viewport.getWindowWidth(),
					h = Ext.Viewport.getWindowHeight();

				me.adjustSize(me, w, h);
				me.setLang(me, GayGuideApp.lang, null);
				GayGuideApp.cards.favsList = me;
				me.refresh();
			},
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			}
		}
	},

	setLang: function(me, newlang, oldlang) {
		if (newlang != oldlang) {
			me.setEmptyText(
				'<div style="width: 500px; margin: 100px auto 0 auto">'+
				'<h1 style="font-size: 1.3em; font-weight:bold;">'+
				Ux.locale.Manager.get("misc.noFavsYet", " No favorites Yet!")+
				'</h1><p style="padding: 20px">'+
				Ux.locale.Manager.get("misc.noFavsYetText", "Select your favorites at any time you are looking at a listing by pressing the star in the upper right hand corner.")+
				'</p><img src="resources/images/pix1.jpg" ></div>'
			);
		}
	},
  
    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            list = mc.child('#favsList');

        if (list) {
            var position = list.getScrollable().getScroller().position.y;
            var selection = list.getSelection()[0];
            var index = selection && list.getStore().indexOf(selection);
            var state = {
                position: position,
                selectindex: index
            };
            return state;
        }
        return null;
    },

	adjustSize: function(me, w, h) {
		if (w < GayGuideApp.narrowLimit) {
			me.addCls('narrow');
		}
		else {
			me.removeCls('narrow');
		}

	}
});

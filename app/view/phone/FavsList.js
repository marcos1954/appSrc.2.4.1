/**
 *
 */
Ext.define('GayGuideApp.view.phone.FavsList', {
	extend: 'Ext.dataview.List',
	xtype:  'favslistphone',
	alias: 'widget.favslist',

    config: {
		id:                'favsList',
		store:             'favsListStore',
		cls:               'ggv-places-list ggv-favorites-list',
		layout:            'fit',
		deferEmptyText:    false,
		onItemDisclosure:  true,
		disableSelection:  true,
		ui: 'round',

		itemTpl:  [
		'<div class="ggv-pl-item<tpl if="fav == 1"> favorite</tpl><tpl if="notes"> notes</tpl>" >',
		 '<div class="ggv-fav-star" >5</div>',
		 '<div class="ggv-fav-note" >(</div>',
		 '<div class="ggv-item-inner">',
		  '<span class="ggv-places-list-name" >{list_name}</span>',
		  '<br />',
		  '<span class="ggv-places-list-loc" >',
		   '{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}',
		  '</span>',
		 '</div>',
		'</div>'
		],

		items: [{
			xtype:        'titlebar',
			cls:          'sliderToolbar',
			enableLocale:  true,
			locales:       { title : 'misc.favorites' },
			docked:        'top',
			items: [{
				xtype:    'button',
				iconMask: true,
				iconCls:  'list',
				name:     'slidebutton'
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
				me.setLang(me, GayGuideApp.lang, null);
				GayGuideApp.cards.favsList = me;
				me.refresh();
			}
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

	setLang: function(me, newlang, oldlang) {
		if (newlang != oldlang) {
			me.setEmptyText(
				'<div style="width: 300px; margin: 20px auto 0 auto">'+
				'<h1 style="font-size: 1.3em; font-weight:bold;">'+
				Ux.locale.Manager.get("misc.noFavsYet", " No favorites Yet!")+
				'</h1><p style="padding: 20px">'+
				Ux.locale.Manager.get("misc.noFavsYetText", "Select your favorites at any time you are looking at a listing by pressing the star in the upper right hand corner.")+
				'</p> <img src="resources/images/pix1.jpg"  style="height: 40%; width= 40%;" > </div>'
			);
		}
	}
});

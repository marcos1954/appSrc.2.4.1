/**
 *
 */
Ext.define('GayGuideApp.view.phone.RecentsListPhone', {
	extend: 'Ext.dataview.List',
	xtype:  'recentslistphone',

	config: {
		id:                     'recentsList',
		store:                  'recentsListStore',
                                      
		cls:                    'ggv-places-list ggv-favorites-list',
		layout:                 'fit',
		grouped:                false,
		deferEmptyText:         false,
		onItemDisclosure:       true,
		disableSelection:       true,
		ui: 'round',

		items: [{
			xtype:             'titlebar',
			cls:               'sliderToolbar',
			enableLocale:       true,
			locales:            { title : 'misc.recently' },
			docked:             'top',
			items: [{
				xtype:          'button',
				iconMask:       true,
				iconCls:        'list',
				name:           'slidebutton',
				align:          'left'
			},{
				xtype:          'button',
				ui:             'decline',
				enableLocale:   true,
				locales:        { text : 'buttons.clear' },
				text:           'clear',
				name:           'clearbutton',
				align:          'right'
			}]
		}],

		itemTpl:  [
			'<div class="ggv-pl-item<tpl if="fav == 1"> favorite</tpl><tpl if="notes"> notes</tpl>" >',
			 '<div class="ggv-fav-star" >5</div>',
			 '<div class="ggv-fav-note" >(</div>',
			 '<div class="ggv-item-inner">',
			  '<span class="ggv-places-list-name" >{list_name}</span>',
			 '</div>',
			 '<span style="top: 0; left: 0;" class="ggv-places-list-loc" >',
			  '{[ GayGuideApp.ggv.lastVisit2string(values.lastVisit) ]}',
			 '</span>',
			'</div>'
		],

		listeners: {
			langchanged: function(me, newlang, oldlang) {
				me.setLang(me, newlang, oldlang);
				me.refresh();
			},
			initialize: function(me) {
				var w = Ext.Viewport.getWindowWidth(),
					h = Ext.Viewport.getWindowHeight();

				me.adjustSize(me, w, h);
				me.setLang(me, GayGuideApp.lang, null);
				GayGuideApp.cards.recentsList = me;
				me.refresh();
			},
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			}
		}
	},

	setLang: function(me, newlang, oldlang) {
		if (newlang != oldlang) {
			me.setEmptyText( ''
				//'<div style="width: 500px; margin: 100px auto 0 auto">'+
				//'<h1 style="font-size: 1.3em; font-weight:bold;">'+
				//Ux.locale.Manager.get("misc.noFavsYet", " No favorites Yet!")+
				//'</h1><p style="padding: 20px">'+
				//Ux.locale.Manager.get("misc.noFavsYetText", "Select your favorites at any time you are looking at a listing by pressing the star in the upper right hand corner.")+
				//'</p><img src="resources/images/pix1.jpg" ></div>'
			);
		}
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

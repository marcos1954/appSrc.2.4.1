/**
 *
 */
Ext.define('GayGuideApp.view.tablet.RecentsListTablet', {
	extend: 'Ext.dataview.List',
	xtype:  'recentslisttablet',
	alias:  'widget.recentslist',

	config: {
		//id:                    'recentsList',
		store:                 'recentsListStore',
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
					'<img src="http://www.gayguidevallarta.com{list_src}"/>',
				'</div>',

				'<div class="ggv-pl-name">',
					'<span class="name" >{list_name}</span>',
					'<br />',
					'<span class="cat">{list_cat_name}</span><br />',
					'<span class="loc" >{[ GayGuideApp.ggv.lastVisit2string(values.lastVisit) ]}</span>',
				'</div>',

				'<div class="ggv-pl-star">',,
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
			locales:         { title : 'misc.recently' },
			docked:          'top',
			items: [{
				xtype:   'button',
				iconMask: true,
				iconCls: 'list',
				name:    'slidebutton',
				align: 'left'
			},{
				xtype:   'button',
				ui: 'decline',
				enableLocale:    true,
				locales:         { text : 'buttons.clear' },
				text: 'clear',
				name: 'clearbutton',
				align: 'right'
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
			//ggv_log('recentsList langchanged', newlang);
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

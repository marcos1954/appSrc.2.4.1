/**
 *
 */
Ext.define("GayGuideApp.view.tablet.NotesListTablet", {
	extend: "Ext.List",
	xtype: 'noteslisttablet',
	alias: 'widget.noteslist',

	config: {
		itemId:                'notesList',
		cls:                   'ggv-places-list',
		layout:                'fit',
		store:                 null,
		grouped :              false,
		scrollable:            true,
		allowDeselect:         true,
		deferEmptyText:        false,
		indexBar:              false,
		variableHeights:       false,
		refreshHeightOnUpdate: false,
		onItemDisclosure:      true,
		disableSelection:      true,
		itemHeight:            144,
		ui:                    'round',

		itemTpl: [
			'<div style="width: 100%; height: 120px; overflow: hidden;">',
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
					'<span class="cat">{list_cat_name}</span>',
					 '<br />',
					'<span class="loc" >{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}</span>',
				'</div>',

				'<div class="ggv-pl-star">',
					'<tpl if="fav == 1">',
						'<img src="http://www.gayguidevallarta.com/images/star.png" />',
					'</tpl>',
				'</div>',

				'<div class="ggv-pl-desc" style="color: #10a; font-family: \'Verdana-Italic\', sans !important;" >',
					'{notes}',
				'</div>',
			'</div>'
		],

		items: [{
			docked: 'top',
			xtype:  'statusbar'
		},{
			docked: 'top',
			xtype:  'toolbar',
			cls:    'sliderToolbar',
			itemId: 'notesListToolbar',
			title:  'My Notes',

			items: [{
				xtype:    'button',
				name:     'slidebutton',
				iconCls:  'list',
				ui:       'plain',
				iconMask: true
			}]
		}],

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
				me.refresh();
				GayGuideApp.cards.notesList = me;
			},
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			}
		}
	},
	
  
    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            list = mc.child('#notesList');

        if (list) {
            var position = list.getScrollable().getScroller().position.y,
				selection = list.getSelection()[0],
				index = selection && list.getStore().indexOf(selection),
				state = {
					position: position,
					selectindex: index
				};
				
            return state;
        }
        return null;
    },


	setLang: function(me, newlang, oldlang) {
		if (newlang != oldlang) {
			me.setEmptyText('<div style="width: 500px; margin: 100px auto 0 auto">'+
				'<h1 style="font-size: 1.3em; font-weight:bold;">'+
				Ux.locale.Manager.get("misc.noNotesYet", " No Notes Yet!")+
				'</h1><p style="padding: 20px">'+
				Ux.locale.Manager.get("misc.noNotesYetText", "Add your notes at any time you are looking at a listing by pressing the notes icon in the upper right hand corner.")+
				'</p><img src="resources/images/pix4.jpg" ></div>');
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

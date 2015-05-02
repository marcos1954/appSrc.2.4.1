/**
 *
 */
Ext.define("GayGuideApp.view.phone.NotesListPhone", {
	extend: "Ext.List",
	xtype: 'noteslistphone',
	alias: 'widget.noteslist',

	config: {
		id:                    'notesList',
		store:                 null,
		grouped :              false,
		scrollable:            true,
		ui: 				   'round',
		allowDeselect:         true,
		variableHeights:       true,
		onItemDisclosure:      true,
		disableSelection:      true,
		indexBar:              false,
		cls:                   'ggv-places-list ggv-favorites-list ggv-fl',

		itemTpl: [
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
			 '<div style=" margin-left: 40px; color: #10a; font-family: \'Verdana-Italic\', sans !important;" >',
			  '{notes}',
			 '</div>',
			'</div>'
		],

		items: [{
			docked: 'top',
			xtype:  'toolbar',
			cls:    'sliderToolbar',
			itemId: 'notesListToolbar',
			title:  'My Notes',

			items: [{
				xtype: 'button',
				iconMask: true,
				iconCls: 'list',
				name: 'slidebutton'
			}]
		}],

		listeners: {
			langchanged: function(me, newlang, oldlang) {
				me.setLang(me, newlang, oldlang);
				me.refresh();
			},
			initialize: function(me) {
				me.setLang(me, GayGuideApp.lang, null);
				me.refresh();
				GayGuideApp.cards.notesList = me;
			}
		}
	},

    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            list = mc.child('#notesList');

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
				Ux.locale.Manager.get("misc.noNotesYet", " No Notes Yet!")+
				'</h1><p style="padding: 20px">'+
				Ux.locale.Manager.get("misc.noNotesYetText", "Add your notes at any time you are looking at a listing by pressing the notes icon in the upper right hand corner.")+
				'</p><img src="resources/images/pix4.jpg" style="height: 40%; width= 40%;" ></div>'
			);
		}
	}
});

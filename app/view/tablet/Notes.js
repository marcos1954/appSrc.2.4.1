Ext.define("GayGuideApp.view.tablet.Notes", {
    extend: "Ext.form.Panel",
	
	xtype:         'notes',
	
	config: {
		hidden:     true,
		height:     300,
		width:      600,
		modal:      true,
		scrollable: false,

		items: [{
			docked: 'top',
			xtype:  'titlebar',
			title:   'Notes',
			defaults: {
				handler: function() {
					GayGuideApp.popups.notes.hide();
				}
			},
			items: [{
				align:    'left',
				locales : { text : 'buttons.cancel' },
				ui: 'normal'
			},{
				itemId:   'notesDone',
				align:    'right',
				locales : { text : 'buttons.done' },
				ui: 'confirm'
			}]
		},{
			xtype:      'textareafield',
			layout:     'fit',
			maxRows:    10,
			name:       'notes',
			scrollable: 'vertical',
			labelWidth:  0,
			placeHolder: 'My Notes'
		}]
	}
});
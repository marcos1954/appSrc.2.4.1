Ext.define("GayGuideApp.view.phone.PhoneStatusBar", {
	extend: "Ext.Container",
	xtype: 'phonestatusbar',

	config: {
        height: 17,
        layout: 'hbox',
        style:  'background-color: black; z-index: 6;',
        hidden: false,
        
        items: [{
            id: 'leftStatusBar',
            xtype: 'container',
            html: '',
            style: 'padding-left: 1em; color: #ddd; font-weight: 300; font-size: 0.6em;'
        },{
            xtype: 'spacer'
        },{
            id: 'centerStatusBar',
            xtype: 'container',
            html: '',
            style: 'color: white; font-size: 0.6em;'
        },{
            xtype: 'spacer'
        },{
            id: 'rightStatusBar',
            xtype: 'container',
            html: '',
            style: 'padding-right: 1em; color: white; font-size: 0.6em;'
        }]
    },
    
    setLeft: function(a) {
        this.down('#leftStatusBar').setHtml(a);
        return this;
    },
    setCenter: function(a) {
        this.down('#centerStatusBar').setHtml(a);
        return this;
    },
    setRight: function(a) {
        this.down('#rightStatusBar').setHtml(a);
        return this;
    },
    clearAll: function() {
        this.setLeft('');
        this.setCenter('');
        this.setRight('');
        return this;
    }
});

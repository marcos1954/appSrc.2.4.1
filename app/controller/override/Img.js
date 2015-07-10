Ext.define('GayGuideApp.controller.override.Img',{
    override:'Ext.Img',
    
    initialize: function() {
        var me = this;
        me.callSuper();
    
        me.relayEvents(me.renderElement, '*');
        
        me.element.on({
            longpress: 'onLongPress',
            scope: me
        });
    },
        
    onLongPress: function(e, t) {
        this.fireEvent('longpress', this, e, t);
    }
});
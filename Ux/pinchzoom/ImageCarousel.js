/**
 *
 */
Ext.define('Ux.pinchzoom.ImageCarousel', {
    extend: "Ext.Carousel",
    requires: "Ux.pinchzoom.ImageViewer",

    xtype: 'pinchimagecarousel',

    config: {
        listeners: {
            initialize: function() {
                this.maskOnSlide = true;
            },
            activeitemchange: function(container, value, oldValue, eOpts) {
                if (oldValue) {
                    try {oldValue.resetZoom();} catch(e){}
                    try {this.getActiveItem().resize();} catch(e){}
                }
            },
            resize: function(component, eOpts) {
                try {this.getActiveItem().resize();} catch(e){}
            }
        }
    },
    onDragStart: function(e) {
        var scroller = this.getActiveItem().getScrollable().getScroller();
        if (e.targetTouches.length === 1 && (e.deltaX < 0 && scroller.getMaxPosition().x === scroller.position.x) || (e.deltaX > 0 && scroller.position.x === 0)) 
            this.callParent(arguments);
    },
    onDrag: function(e) {
        if (e.targetTouches.length == 1)
            this.callParent(arguments);
    },
    onDragEnd: function(e) {
        if (e.targetTouches.length < 2)
            this.callParent(arguments);
    }
});

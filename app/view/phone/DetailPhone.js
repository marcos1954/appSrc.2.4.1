/**
 *
 */
Ext.define("GayGuideApp.view.phone.DetailPhone", {
    extend: "Ext.tab.Panel",
    xtype: 'placesdetailphone',
    alias: ['widget.placesdetail'],

    requires: [
        'Ext.Toolbar',
        'Ext.Anim',
        'Ux.tab.OptimizedTab',
        'Ux.pinchzoom.ImageViewer',
        'GayGuideApp.view.PlacesEvents',
        'GayGuideApp.view.PlacesInfo',
        'GayGuideApp.view.PlacesMap'
    ],

    config: {
        layout:       { animation: { type: 'fade', duration: 100 } },
        cls:          'ggv-places-detail',
        enableLocale: true,

        tabBar: {
            docked:       'top',
            cls:          'sliderToolbar',
            layout:       { pack: 'center' },
            style:        "font-size: 90%;"
        },

        listeners: {
            sizechange: function(me,  width, height) {
                me.adjustSize(me, width, height);
            },

            show: function(me) {
                var w = Ext.Viewport.getWindowWidth(),
                    h = Ext.Viewport.getWindowHeight();

                me.adjustSize(me, w, h);
            },

            initialize : function(me) {
                var tabbar = this.getTabBar(),
                    topbar = this.down('toolbar'),
                    w = Ext.Viewport.getWindowWidth(),
                    h = Ext.Viewport.getWindowHeight();

                topbar.add([{
                    docked:       'left',
                    itemId:       'backButton',
                    xtype :       'button',
                    iconCls: 'arrow_left',
                    ui:           'plain'
                    //enableLocale: true,
                    //locales:      { text: 'nav.button.back' }
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'next',
                    ui:           'plain',
                    iconCls:      'next'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'last',
                    ui:           'plain',
                    iconCls:      'last'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'flag',
                    ui:           'plain',
                    iconCls:      'flag'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'compose2',
                    ui:           'plain',
                    iconCls:      'compose2'
                }]);

                tabbar.add([{
                    docked:       'left',
                    itemId:       'backButton',
                    xtype :       'button',
                    iconCls: 'arrow_left',
                    ui:           'plain'
                    //ui:           'back',
                    //enableLocale: true,
                    //locales:      { text: 'nav.button.back' }
                }]);
            }
        },

        items: [{
            docked:         'top',
            xtype:          'toolbar',
            cls:            'sliderToolbar'
        },{
            items: [{
                itemId:     'placesInfo',
                xtype:      'placesinfo',
                layout:     'card'
            }],
            layout:         'card',
            title:          'INFO',
            enableLocale:   true,
            locales:        { title: 'places.tab.info' }
        },{
            itemId:         'PhotoContainer',
            items: [{
                itemId:     'Photo',
                indicator:  true,
                layout:     'card',
                cls:        'blackback noSliderToolbar',
                xtype:      'pinchimagecarousel'
            }],
            layout:         'card',
            title:          'PHOTOS',
            enableLocale:   true,
            locales:        { title: 'places.tab.photos' }
        },{
            items: [{
                itemId:     'placesEvents',
                xtype:      'placesevents'
            }],
            xtype:          'placesevents',
            layout:         'card',
            title:          'EVENTS',
            enableLocale:   true,
            locales:        { title: 'places.tab.events' }
        },{
            items: [{
                itemId:     'detailMap',
                xtype:      'cachemap',
                debug:                 false,
                cacheFitBounds:        true,
                trackLoc:              false,
                cacheLocation:         true,
                cacheDirections:       true,
                noLinkInInfoWindow:    true
            }],
            layout:         'card',
            title:          'MAP',
            cls:            'noSliderToolbar',
            enableLocale:   true,
            locales:        { title: 'places.tab.map' }
        }]
    },

    adjustSize: function(me, w, h) {
        if (!me || !me.down('toolbar') || !me.down('tabbar')) return;

        if (h > GayGuideApp.narrowLimit) {
            me.down('toolbar').show();
            me.down('tabbar').down('#backButton').hide();
        }
        else {
            me.down('toolbar').hide();
            me.down('tabbar').down('#backButton').show();
        }

        if (me._ggv_list) {
            me.down('toolbar').down('#next').show();
            me.down('toolbar').down('#last').show();
        }
        else {
            me.down('toolbar').down('#next').hide();
            me.down('toolbar').down('#last').hide();
        }
    },

    scrollToTop: function(me) {
        me.query('#Photo')[0].setActiveItem(0);
        Ext.each([ '#placesEvents', '#placesInfo', '#placesEvents'], function( item) {
            me.query(item)[0].getScrollable().getScroller().scrollTo(0, 0);
        });
    }
});

/**
 *
 */
Ext.define("GayGuideApp.view.tablet.DetailTablet", {
    extend: "Ext.TabPanel",
    xtype: 'placesdetailtablet',
    alias: ['widget.placesdetail'],

    requires: [
        'Ext.Toolbar',
        'Ext.Anim',
        'Ux.pinchzoom.ImageViewer',
        'GayGuideApp.view.PlacesEvents',
        'GayGuideApp.view.PlacesInfo',
        'GayGuideApp.view.PlacesMap',
        'GayGuideApp.view.tablet.PlacesPhotoBar',
        'GayGuideApp.view.tablet.PlacesCombo'
    ],

    config: {
        layout:       { type: 'card', animation: {type: 'fade', duration: 100 } },
        cls:          'ggv-places-detail',

        tabBar: {
            docked:       'top',
            ui:           'dark',
            cls:          'sliderToolbar',
            layout:       { pack: 'center' }
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
                var bar = this.getTabBar(),
                    topbar = this.down('toolbar');

                topbar.add([{
                    docked:       'left',
                    itemId:       'backButton',
                    xtype :       'button',
                    hidden:       true,
                    iconCls:      'arrow_left',
                    ui:           'plain'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'next',
                    ui:           'plain',
                    hidden:       true,
                    iconCls:      'next'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'last',
                    ui:           'plain',
                    hidden:       true,
                    iconCls:      'last'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'flag',
                    ui:           'plain',
                    hidden:       true,
                    iconCls:      'flag'
                },{
                    docked:       'right',
                    xtype :       'button',
                    itemId:       'compose2',
                    ui:           'plain',
                    hidden:       true,
                    iconCls:      'compose2'
                }]);

                bar.add([{
                    docked:       'left',
                    itemId:       'backButton',
                    xtype :       'button',
                    iconCls:      'arrow_left',
                    ui:           'plain'
                },
  
                //{
                //    docked:       'left',
                //    //itemId:       'backButton',
                //    xtype :       'button',
                //    //ui:           'back',
                //    hidden:       false,
                //    iconCls: 'arrow_left',
                //    ui:           'plain',
                //    style: 'visibility: none;'
                //
                //},
                
                
                {
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
            }
        },

        items: [{
            docked:       'top',
            xtype:        'statusbar'
        },{
            docked:       'top',
            xtype:        'toolbar',
            itemId:       'toolbar'
        },{
            items: [{
                itemId:       'placesCombo',
                xtype:        'placescombo'
            }],
            layout:       'card',
            title:        'INFO',
            enableLocale: true,
            locales:      { title: 'places.tab.info' }
        },{
            itemId:       'PhotoContainer',
            items: [{
                itemId:       'Photo',
                xtype:        'pinchimagecarousel',
                layout:       'card',
                cls:          'blackback noSliderToolbar',
                indicator:    true
            }],
            layout:       'card',
            title:        'PHOTOS',
            enableLocale: true,
            locales:      { title: 'places.tab.photos' }
        },{

            items: [{
                itemId:       'placesEvents',
                xtype:        'placesevents'
            }],
            layout:       'card',
            title:        'EVENTS',
            enableLocale: true,
            locales:      { title: 'places.tab.events' }
        },{

            items: [{
                itemId:       'placesMenu',
                xtype:        'pinchimagecarousel',
                indicator:    true,
                layout:       'card',
                cls:          'blackback noSliderToolbar'
            }],
            layout:       'card',
            title:        'MENU',
            enableLocale: true,
            locales:      { title: 'places.tab.menu' }
        },{

            items: [{
                itemId:       'detailMap',
                xtype:        'cachemap',
                debug: false,
                cacheFitBounds:        true,
                trackLoc:              false,
                cacheLocation:         true,
                cacheDirections:       true,
                noLinkInInfoWindow:    true
            }],
            layout:       'card',
            title:        'MAP',
            cls:          'noSliderToolbar',
            enableLocale: true,
            locales:      { title: 'places.tab.map' }
        }]
    },

    adjustSize: function(me, w, h) {
        var pc = me.down('#placesComboPhotos'),
            toolbar = me.down('toolbar'),
            tabbar = me.down('tabbar'),
            isNarrow = w < GayGuideApp.narrowLimit,
            isShort = h < GayGuideApp.narrowLimit;

        if (!me || !me.down('toolbar') || !me.down('tabbar')) {
            return;
        }

        if (pc) {
            pc.setHidden(isShort);
        }

        if (isNarrow)  {
            me.addCls('narrow');
        }
        else {
            me.removeCls('narrow');
        }

        toolbar.setHidden(!isNarrow)
        toolbar.down('#flag').setHidden(!isNarrow);
        toolbar.down('#compose2').setHidden(!isNarrow);
        toolbar.down('#backButton').setHidden(!isNarrow);
        tabbar.down('#flag').setHidden(isNarrow);
        tabbar.down('#compose2').setHidden(isNarrow);
        tabbar.down('#backButton').setHidden(isNarrow);
        if (me._ggv_list) {
            tabbar.down('#next').setHidden(isNarrow);
            tabbar.down('#last').setHidden(isNarrow);
            toolbar.down('#next').setHidden(!isNarrow);
            toolbar.down('#last').setHidden(!isNarrow);
        }
        else {
            tabbar.down('#next').setHidden(true);
            tabbar.down('#last').setHidden(true);
            toolbar.down('#next').setHidden(true);
            toolbar.down('#last').setHidden(true);
        }
    },

    scrollToTop: function(me) {
        me.down('#Photo').setActiveItem(0);
        Ext.each([ '#placesEvents', '#placesComboInfo', '#placesComboPhotos'], function( item) {
            me.down(item).getScrollable().getScroller().scrollTo(0, 0);
        });
    }
});

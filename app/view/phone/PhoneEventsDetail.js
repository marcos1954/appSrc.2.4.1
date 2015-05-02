/**
 *
 */
Ext.define("GayGuideApp.view.phone.PhoneEventsDetail", {
    extend: "Ext.tab.Panel",
    xtype: 'eventsdetailphone',
    alias: ['widget.eventsdetailtabpanel'],

    requires: [
        'Ext.Toolbar',
        'Ext.Anim',
        'Ux.tab.OptimizedTab'
    ],

    constructor : function (config) {
		var	me = this;

		me.callParent([config]);
		
		me.element.on({
			tap: GayGuideApp.ggv.addCalendarTap,
			delegate: '#addCal'
		});
	},
    

    config: {
        itemId:              'eventsDetail',
        layout:              'card',
        cardSwitchAnimation: 'slide',
        //defaultType:         'optimized-tab',

        tabBar: {
            docked:      'top',
            cls:         'sliderToolbar',
            layout:      { pack: 'center' }
        },

        listeners: {
            sizechange: function(me,  width, height) {
                me.adjustSize(me, width, height);
            },

            initialize : function(me) {
                var     tabbar = this.getTabBar(),
                    topbar = this.down('toolbar'),
                    w = Ext.Viewport.getWindowWidth(),
                    h = Ext.Viewport.getWindowHeight();

                tabbar.add({
                    id:       'eventsDetailMoreInfo',
                    xtype:    'tab',
                    title:    'More',
                    listeners: {
                        order: 'before',
                        tap: function(me){
                            var x = me.up('tabpanel');
                            x.fireEvent('gotodetail', x);
                            return false;
                        }
                    }
                });

                tabbar.add([{
                    docked:       'left',
                    itemId:       'eventsDetailBackButton',
                    xtype :       'button',
                    ui:           'plain',
                    hidden:       true,
                    iconCls:      'arrow_left'
                }]);
				
				tabbar.add([{
                    docked:       'left',
					itemId:       'spacefiller',
                    xtype :       'button',
                    ui:           'plain',
                    iconCls:      'arrow_left',
					style: 'visibility: hidden'
                }]);

                tabbar.add([{
                    docked:       'right',
                    itemId:       'eventsDetailNextButton',
                    xtype:        'button',
                    iconMask:     true,
                    ui:           'plain',
                    iconCls:      'next',
                    hidden:       true
                    }]);

                tabbar.add([{
                    docked:       'right',
                    itemId:       'eventsDetailLastButton',
                    xtype:        'button',
                    iconMask:     true,
                    ui:           'plain',
                    iconCls:      'last',
                    hidden:       true
                    }]);

                me.adjustSize(me, w, h);
            }
        },

        items: [{
            docked :         'top',
            xtype:           'titlebar',
            id:              'eventsDetailToolbar',
            cls:             'sliderToolbar',
            title:           '',

            items: [{
                docked:       'left',
                itemId:       'eventsDetailBackButton',
                xtype :       'button',
                ui:           'plain',
                iconCls:      'arrow_left'
            },{
                id:        'eventsDetailLastButton',
                itemId:    'eventsDetailLastButton',
                xtype:     'button',
                iconMask:   true,
                ui:        'plain',
                iconCls:   'last',
                align:     'right'
            },{
                id:        'eventsDetailNextButton',
                itemId:    'eventsDetailNextButton',
                xtype:     'button',
                iconMask:   true,
                ui:        'plain',
                iconCls:   'next',
                align:     'right'
            }]
        },{
            id:                'eventInfo',
            enableLocale:       true,
            locales:           { title : 'events.tab.info' },
            title:             '&nbsp;',
            layout:            'card',
            scrollable:        'vertical',
            styleHtmlContent:   true,
            cls:               'details',

            tpl: [
            '<div class="detailHdr">',

                '<button id="addCal" style="display: none; background-color: #363; font-weight: bold; color: white; margin: 0 auto 10px auto; padding: 10px; border-radius: 4px;" name="{id}" > ADD TO YOUR CALENDAR </button> ',

                '<div style="clear: all;float: left; margin: 0px 10px 0 0;">',
                    '<img width=80 class="photo" src="http://www.gayguidevallarta.com{logoEventATTRS}"  />',
                '</div>',
                '<div class="infobox"  style="margin-left: 110px;">',
                    '<h3>{list_name}</h3>',
                    
                    '<p  style="word-wrap:break-word; font-size:90%; font-style: italic;">',
                        '<tpl if="list_addr1">',
                            '{list_addr1}<br/>',
                        '</tpl> ',
                        '<tpl if="list_addr2">',
                            '{list_addr2}<br/>',
                        '</tpl> ',
                        '<tpl if="list_addr3">',
                            '{list_addr3}<br/>',
                        '</tpl>' ,
                        '<tpl if="list_phone">',
                            trans('Phone')+'{list_phone}<br />',
                        '</tpl>',
                    '</p>',
                    
                    
                    '<p style="word-wrap:break-word;">',
                    '<strong><span style="font-size: 90%">{catnameEvent}</span><br />',
                    '<span style="font-size: 110%; color: #444444">{nameEvent}</span><br /></strong>',
                    '<tpl if="locationEvent">',
                        '@ {locationEvent}<br />',
                    '</tpl>',
                    '<strong><span style="color:red;">{timesEvent}</span></strong><br />',
                    //'{event_recurs}',
                    '<br /></p>',
                '</div>',
            '</div>',
            '<br clear="all" />',
            '<i>{descEvent}</i><br />',
            '<br />',
            '<div class="desc">',
                '{descEventLong}',
            '</div>'
            ]
        //},{
        //    itemId:           'eventMap',
        //    xtype:        'cachemap',
        //    title:        'MAP',
        //    cls:          'noSliderToolbar',
        //    enableLocale: true,
        //    locales:      { title : 'events.tab.map' },
        //
        //    debug:                 false,
        //    cacheFitBounds:        true,
        //    trackLoc:              false,
        //    cacheLocation:         true,
        //    cacheDirections:       true,
        //    noLinkInInfoWindow:    true,
        //    center: true,
        //    zoom:  14
        }]
    },

    adjustSize: function(me, w, h) {
        if (w > GayGuideApp.narrowLimit) {
			me.down('tabbar').down('#spacefiller').show();
			me.down('titlebar').hide();
            me.down('tabbar').down('#eventsDetailBackButton').show();
            me.down('tabbar').down('#eventsDetailNextButton').show();
            me.down('tabbar').down('#eventsDetailLastButton').show();
            //me.down('titlebar').show();
        }
        else {
			me.down('tabbar').down('#spacefiller').hide();
            me.down('titlebar').hide();
            me.down('tabbar').down('#eventsDetailBackButton').show();
            me.down('tabbar').down('#eventsDetailNextButton').show();
            me.down('tabbar').down('#eventsDetailLastButton').show();
        }
    },

    setData: function(data) {
        this.udata = data;
        this.down('#eventInfo').setData(data);
        this.down('#eventMap') && this.down('#eventMap').setData(Ext.merge(data, {id: data.business_id}));
        //this.down('#eventMap').setData(data);
    }
});

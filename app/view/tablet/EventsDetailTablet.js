/**
 *
 */
Ext.define("GayGuideApp.view.tablet.EventsDetailTablet", {
    extend: "Ext.tab.Panel",
    xtype: 'eventsdetailtablet',
    alias: ['widget.eventsdetailtabpanel'],

    requires: [
        'Ext.Toolbar',
        'Ext.Anim'
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
        itemId:           'eventsDetail',
        layout:           'card',
        enableLocale:     true,

        cardSwitchAnimation: 'fade',

        tabBar: {
            docked:  'top',
            cls:     'sliderToolbar',
            ui:      'dark',
            layout:  { pack: 'center' }
        },

        listeners : {
            initialize : function(panel) {
                var  bar = this.getTabBar();

                bar.add([{
                    docked:       'left',
                    itemId:       'eventsDetailBackButton',
                    xtype :       'button',
                    ui:           'plain',
                    //hidden:       true,
                    iconCls: 'arrow_left'
                },{
                    docked:       'left',
                    xtype :       'button',
                    ui:           'plain',
                    style:        'visibility: hidden;',
                    iconCls: 	  'arrow_left'
                },{
                    itemId:       'eventsDetailMoreInfo',
                    xtype:    'tab',
                    title:    'More',
                    listeners: {
                        order: 'before',
                        tap: function(me){
                            var     x = me.up('#eventsDetail');

                            x.fireEvent('gotodetail', x);
                            return false;
                        }
                    }
                },{
                    docked:   'right',
                    id:       'eventsDetailNextButton',
                    itemId:   'eventsDetailNextButton',
                    xtype:    'button',
                    iconMask: true,
                    ui:       'plain',
                    iconCls:  'next'
                },{
                    docked: 'right',
                    id:       'eventsDetailLastButton',
                    itemId:   'eventsDetailLastButton',
                    xtype:    'button',
                    iconMask: true,
                    ui:       'plain',
                    iconCls:  'last'
                }]);
            }
        },

        items: [{
            docked :      'top',
            xtype:        'statusbar',
            id:           'eventsDetailToolbar',
            title:        '&nbsp;'  // filled dynamically when record loaded
        },{
            xtype:        'container',
            layout:       'hbox',
            itemId:       'eventInfoContainer',
            enableLocale: true,
            locales :     { title : 'events.tab.info' },
            scrollable:   null,
            title:        'INFO',
            items:  [{
                flex: 2,
                itemId: 'eventFlyer',
                xtype:  'container',
                html:     null,
                scrollable: 'vertical'
            },{
                xtype:            'container',
                styleHtmlContent: true,
                cls:              'ggv-events-detail',
                flex:             2,
                itemId:           'eventInfo',
                scrollable:       'vertical',

                tpl: [
                '<div class="detailHdr">',
                    '<button id="addCal" style="display: none; background-color: #363; font-weight: bold; color: white; margin: 0 auto 10px auto; padding: 10px; border-radius: 4px;" name="{id}" > ADD TO YOUR CALENDAR </button> ',

                    '<div style="float: left; margin: 0px 10px 0 0;">',
                        '<tpl if="logoEventATTRS">',  
                            '<img class="photo" width="100" src="http://www.gayguidevallarta.com{logoEventATTRS}"  />',
                        '</tpl> ',
                    '</div>',
                    
                    '<div class="infobox"  style="margin-left: 110px;">',
                       '<h3>{list_name}</h3>',
                       
                       '<p  style="word-wrap:break-word; font-size:90%; font-style: italic;">',
                            '<tpl if="list_addr1">',  '{list_addr1}<br/>','</tpl> ',
                            '<tpl if="list_addr2">','{list_addr2}<br/>','</tpl> ',
                            '<tpl if="list_addr3">','{list_addr3}<br/>','</tpl>' ,
                            '<tpl if="list_phone">',trans('Phone')+'{list_phone}<br />','</tpl>',
                       '</p>',
                       
                       '<p style="word-wrap:break-word;">',
                            '<strong>',
                                '<span style="font-size: 90%">{catnameEvent}</span>',
                                '<br />',
                                '<span style="font-size: 110%; color: #444444">{nameEvent}</span>',
                                '<br />',
                            '</strong>',
                            '<tpl if="locationEvent">','@ {locationEvent}<br />','</tpl>',
                            
                            '<strong>',
                                '<span style="color:red;">{timesEvent}</span>',
                            '</strong>',
                            '<br />',
                            '{event_recurs}',
                            '<br />',
                        '</p>',
                    '</div>',
                '</div>',

                '<br clear="all" />',
                '<div>',
                    '<span style="font-size: 115%;" ><i>{descEvent}</i></span>',
                    '<br />',
                    '<br />',
                '</div>',
                
                '<div class="desc">',
                    '{descEventLong}',
                '</div>'
                ]
            }]
        },{
            id:           'eventMap',
            xtype:        'cachemap',
            title:        'MAP',
            cls:          'noSliderToolbar',
            enableLocale: true,
            locales:      { title : 'events.tab.map' },


            debug:                 false,
            cacheFitBounds:        true,
            trackLoc:              false,
            cacheLocation:         true,
            cacheDirections:       true,
            noLinkInInfoWindow:    true
        }]
    },

    setData: function(data) {
        this.udata = data;

        this.down('#eventInfo').setData(data);
        this.down('#eventMap').setData(Ext.merge({}, data, {id: data.business_id}));

        var f = this.down('#eventFlyer');
        if (f) {
            if (data.event_flyer) {
                var w = Ext.Viewport.getWindowWidth();
                f.setHtml(
                    [
                     '<div style="padding: 10px;">',
                         '<img width="'+Math.floor(w/2)+'" height="auto" src="', 
                             'http://gayguidevallarta.com/img.io/timthumb.php?w=',Math.floor(w/2),
                             '&src=',data.event_flyer ? data.event_flyer : null,
                         '" />',
                     '</div>'
                    ].join('')
                );
                f.show();
            }
            else {
                f.hide();
            }
        }
    }
});

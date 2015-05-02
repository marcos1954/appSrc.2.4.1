/**
 *
 */
Ext.define("GayGuideApp.view.tablet.EventsListTablet", {
    extend: "Ext.Container",

    requires: ['Ext.SegmentedButton'],
    xtype: 'eventslisttablet',

    config: {
        id:       'eventsListCard',
        layout:   'fit',
        listeners: {
            refresh: function(me) {
                if (!me.down('#sunsetPanel')) return true;;
                var w = Ext.Viewport.getWindowWidth(),
                    h = Ext.Viewport.getWindowHeight(),
                    html = [];

                html.push('<div style="height:150px; width: 1024px; background-image: url(\'resources/images/sunsettoday.jpg\');"  >');
                html.push(     '<div style="color: white; padding: 30px 0 0 410px;">');
                html.push(        '<span style="font-size:35px">');
                html.push(            transDayName(GayGuideApp.today)),
                html.push(            '<br />'),
                html.push(            transDate(GayGuideApp.today));
                html.push(        '</span><br />');
                html.push(        '<span style="color: yellow; font-size:18px">');
                html.push(            trans('sunsetToday'));
                html.push(            GayGuideApp.SunsetTimeValue || 'sometime this evening');
                html.push(        '</span>');
                html.push('</div></div>');

                me.down('#sunsetPanel').setHtml(html.join(''));

                me.adjustSize(me, w, h);

                return true;
            },

            painted: function(me) {
                //GayGuideApp.app.getApplication().getController('EventsController').doEventsListShow();
                //GayGuideApp.cards.eventsList.down('list').refresh();
            },

            sizechange:  function(me, width, height) {
                me.adjustSize(me, width, height);
            }
        },


        items: [{
            docked:   'top',
            xtype:    'statusbar'
        },{
            docked:   'top',
            xtype:    'toolbar',
            cls:      'sliderToolbar',
            id:       'eventsListToolbar',
            title:    '',

            defaults: {
                xtype:  'button',
                ui:     'plain',
                iconMask: true
            },

            items: [{
                itemId:          'menuMore',
                iconCls:         'list',
                name:            'slidebutton'
            },{
                xtype:           'spacer'
            },{
                xtype:           'segmentedbutton',
                ui:              'ggv',
                allowMultiple:   false,
                allowDepress:    false,

                defaults: {
                    ui:          'ggv',
                    pressed:     false,
                    minWidth:    '60px',
                    enableLocale: true
                },
                items: [{
                    id:          'events-filter-events',
                    locales:      { text: 'events.button.events' },
                    pressed:      true
                },{
                    id:           'events-filter-tours',
                    locales:      { text: 'events.button.tours' }
                },{
                    id:           'events-filter-meetings',
                    locales:      { text: 'events.button.meetings' }
                },{
                    id:           'events-filter-specials',
                    locales:      { text: 'events.button.promos'    }
                },{
                    id:           'events-filter-all',
                    locales:      { text: 'events.button.all'   }
                }]
            },{
                xtype:    'spacer'
            },{
                itemId:   'eventsDayPrev',
                iconCls:  'arrow_left'
            },{
                itemId:   'setEventsDateButtonTablet',
                iconCls:  'calendar'
            },{
                itemId:   'eventsDayNext',
                iconCls:  'arrow_right'
            },{
                xtype:    'spacer',
                maxWidth: '20px'
            },{
                itemId:   'eventsFavsOnlyButton',
                iconCls:  'star'
            }]
        },{
            docked:     'top',
            xtype:      'panel',

            cls:        'noSliderToolbar',
            id:         'sunsetPanel',
            style:      'height: 150px; padding: 0;',
            scrollable: 'horizontal',

            listeners: {
                show: function(me) {
                    me.getScrollable().getScroller().scrollTo(0, 0);
                }
            }
        },{
            xtype: 'eventslist',
            cls:                   'ggv-events-list',
            layout:                'fit',
            //store:                 'eventsList',

            //indexBar:              false,
            grouped:               true,
            loadingText:           null,
            infinite:              false,
            useSimpleItems:        true,
            emptyText:             trans('noEventsMsg'),
            variableHeights:       false,
            refreshHeightOnUpdate: false,
            onItemDisclosure:      true,
            disableSelection:      true,
            scrollToTopOnRefresh:  false,
            itemHeight:            154,

            ui: 'round',
            pinHeaders: false,

            listeners: {
                initialize: function(me) {
                    me.setPinHeaders(true);
                }

            },

            itemTpl: [
              '<div style="width: 100%; height: 130px; overflow: hidden;">',

                // event logo
                //
                '<div class="ggv-el-logo">',
                    '<img class="photo" width="100" src="',
                        '<tpl if="logoEventATTRS">',  
                            'http://www.gayguidevallarta.com{logoEventATTRS}',
                        '</tpl> ',
                    '"  />',
                '</div>',
                
                // event name, biz name, location
                //
                '<div class="ggv-el-name">',
                    '<span class="ggv-event-list-eventname">',
                        '{nameEvent}',
                        '<br />',
                    '</span>',

                    '<span class="ggv-event-list-name">',
                        '{list_name} ',
                        '<br />',
                    '</span>',
                    
                    ' <span class="ggv-event-list-cat-name">',
                        '{catnameEvent}',
                        '<br />',
                    '</span>',
                    '<span class="ggv-event-list-loc">',
                        '{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]} ',
                    '</span>',
                '</div>',

                '<div style="width: 37px; float: left; padding-top: 5px; padding-right: 5px;">',
                    '<tpl if="fav == 1">',
                        '<img src="http://www.gayguidevallarta.com/images/star.png" height="35" width="35" />',
                    '<tpl else>',
                        '&nbsp;',
                    '</tpl>',
                '</div>',

                //
                // start time clockface
                //
                '<div class="clock" style="float: left; margin-top: 5px;">',
                    '<div class="clockhighlight1">',
                        '<div class="clockface">',
                            '<tpl if="timesEvent">',
                                '<div class="hourhand" style=" -webkit-transform: rotate({[ GayGuideApp.ggv.timeHrRotation(values.startTime)  ]}deg); "  ></div>',
                                '<div class="minhand" style="  -webkit-transform: rotate({[ GayGuideApp.ggv.timeMinRotation(values.startTime)  ]}deg); "  ></div>',
                            '</tpl> ',
                        '</div>',
                    '</div>',
                    '<tpl if="timesEvent">',
                        '<div style="padding-top: 2px;font-size: 0.8em; line-height: 85%;  color: gray; font-weight: 500; text-align: center;"> {[ GayGuideApp.ggv.startTimesEvent(values.startTime) ]} </div>',
                    '<tpl else>',
                        '<div style="padding-top: 2px;font-size: 0.8em; line-height: %;  color: gray; font-weight: 500; text-align: center;"> all<br />day </div>',
                    '</tpl> ',
                '</div>',

                //
                // event description
                //
                '<div class="ggv-el-desc">',
                    '{descEvent}',
                '</div>',
                '<br  clear="all" />',
              '</div>'
            ]
        }]
    },
    
    saveState: function() {
        var nav = GayGuideApp.cards.viewport,
            mc = nav.container,
            active = mc.down('#eventsListCard');
            
            
        if (active) {
            //var selectedIndex = active.child('list')._ggv_selected;
            var theButton = active.down('segmentedbutton').getPressedButtons()[0];
            var buttons = active.down('segmentedbutton').getInnerItems();
            var filterset = buttons.indexOf(theButton);
            
            var position = active.down('list').getScrollable().getScroller().position.y;
            var selection = active.down('list').getSelection()[0];
            var index = selection && active.down('list').getStore().indexOf(selection);
            var state = {
                filterset: filterset,
                position: position,
                selectindex: index
            };
            return state;
        }
        return null;
    },

    adjustSize: function(me, w, h) {
        if (me.down('#sunsetPanel')) {
            if (h < GayGuideApp.narrowLimit) {
                me.down('#sunsetPanel').hide();
            }
            else {
                me.down('#sunsetPanel').show();
            }
        }

        if (w < GayGuideApp.narrowLimit) {
            me.addCls('narrow');
        }
        else {
            me.removeCls('narrow');
        }
    }
});

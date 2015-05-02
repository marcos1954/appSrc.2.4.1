/**
 *
 */
Ext.define("GayGuideApp.view.EventsList", {
	extend: 'Ext.dataview.List',

    xtype:                'eventslist',

    config: {
        id:               'eventsList',
        cls:              'ggv-events-list',
        store:            'eventsStore',
        emptyText:        trans( 'noEventsMsg'),
		layout:           'fit',
		
        grouped:          true,
        infinite:         false,
        useSimpleItems:   true,
        variableHeights:  false,
		itemHeight:       110,
        onItemDisclosure: true,
        disableSelection: true, 
        loadingText:      null,

        listeners: {
            refresh: function(me) {
				var el = GayGuideApp.cards.eventsList;
				
                el && el.fireEvent('refresh', el);
            }
        },

        itemTpl: [
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
                    '<div style="padding-top: 2px;font-size: 0.8em; line-height: 85%;  color: gray; font-weight: 500; text-align: center;"> all<br />day </div>',
                '</tpl>',
            '</div>',
            '<div style=" margin-left: 50px; margin-right: 34px;padding-right: 0px;">',
                ' <span class="ggv-event-list-eventname">',
                '{nameEvent}',
                '<br /></span>',

                ' <span class="ggv-event-list-name">',
                '{list_name} ',
                '<br /></span>',

                //'<div class="ggv-event-list-desc">',
                //    '{descEvent}',
                //'</div>',
            '</div>',
            '<br clear="all" />'
        ]
    },

    restoreItems: function(me) {
        //if (me._optimizedItems) me.onActivate(me);
    }
});

/**
 *
 */
Ext.define("GayGuideApp.view.phone.PhoneEventsList", {
    
    extend:     "Ext.Container",
    requires:   ['Ext.SegmentedButton'],
    xtype:      'phoneeventslist',

    config: {
        id:     'eventsListCard',
        layout: 'fit',

        items: [{
            docked:               'top',
            xtype:                'toolbar',
            cls:                  'sliderToolbar',
            id:                   'eventsListToolbar',
            title:                '',

            defaults: {
                xtype:            'button',
                ui:               'ggv-round'
            },

            items: [{
                xtype:            'button',
                itemId:           'menuMore',
                iconMask:         true,
                ui:               'plain',
                iconCls:          'list',
                name:             'slidebutton'
            },{
                xtype:            'spacer'
            },{
                xtype:            'segmentedbutton',
                height:           '1.8em',
                allowMultiple:    false,
                allowDepress:     false,

                defaults: {
                    ui:          'ggv',
                    minWidth:    '55px',
                    pressed:      false
                },
                items: [{
                    id:            'events-filter-events',
                    filterIndex:   [0,1,2],
                    locales:       { text: 'events.button.events' },
                    enableLocale:  true,
                    pressed:       true
                },{
                    id:           'events-filter-specials',
                    filterIndex:  [3],
                    locales:      { text: 'events.button.promos' },
                    enableLocale:  true
                },{
                    id:            'events-filter-all',
                    filterIndex:   [-1],
                    locales:       { text: 'events.button.all' },
                    enableLocale:   true
                }]
            },{
                xtype: 'spacer'
            },{
                itemId:            'setEventsDateButtonPhone',
                xtype:             'button',
                iconMask:           true,
                ui:                'plain',
                iconCls:           'calendar'
            }]
        },{
            xtype: 'eventslist',
            disableSelection: true,
            ui: 'round',
            listeners: {
				initialize: function(me) {
					me.setPinHeaders(true);
				}
			}
        }],
        
        listeners: {
            painted: function(me) {
                GayGuideApp.app.getApplication().getController('EventsController').doEventsListShow();
                GayGuideApp.cards.eventsList.down('list').refresh();
            }
        }
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
    }
});

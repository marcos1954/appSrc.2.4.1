/**
 *  Controller for the onne-day-at-a-time calendar
 *
 *  store is EventsStore
 *  model is Today
 *
 *  this controller handles the following views EventsList and EventsDetail
 *
 *
 *
 */
Ext.define("GayGuideApp.controller.EventsController", {
    extend: "Ext.app.Controller",

    requires: [
        'Ux.datepicker.DatePicker'
    ],

    config: {
        debug: false,
        routes: {
            'eventslist':       'showEventsList',
            'events/:id':       'showEventsId'
        },
        
        before: {
            'showEventsList':   'hello',
            'showEventsId':     'hello' 
        },
        
        refs: {
            eventsDetail:       'tabpanel[itemId="eventsDetail"]',
            eventsDetailBack:   '#eventsDetail button[itemId="eventsDetailBackButton"]',

            eventsDetailNext:   '#eventsDetail button[itemId="eventsDetailNextButton"]',
            eventsDetailPrev:   '#eventsDetail button[itemId="eventsDetailLastButton"]',
            eventsDetailMore:   'tabpanel tabbar tab[itemId="eventsDetailMoreInfo"]',

            eventsList:         'eventslist',
            eventsListCard:     '#eventsListCard',
            eventsSelectFilter: '#eventsListCard segmentedbutton',
            eventsNav:          '#eventsListCard toolbar > button[itemId="menuMore"]',
            favsOnlyButton:     '#eventsListCard toolbar > button[itemId="eventsFavsOnlyButton"]',
            eventsDayPrev:      '#eventsListCard toolbar > button[itemId="eventsDayPrev"]',
            eventsDayNext:      '#eventsListCard toolbar > button[itemId="eventsDayNext"]',
            setEventsDateTablet:'#eventsListCard toolbar > button[itemId="setEventsDateButtonTablet"]',
            setEventsDatePhone: '#eventsListCard toolbar > button[itemId="setEventsDateButtonPhone"]'
        },
        
        control: {
            eventsDetailBack: {
                tap:            'doEventsDetailBack'
            },

            eventsDetailBackAlt: {
                tap:            'doEventsDetailBack'
            },

            eventsNav: {
                tap:            'doNavButton'
            },
            eventsList: {
                showEventsList: 'doEventsListShow',
                calLoadReq:     'doEventsListStart',
                //select:         'doEventItemSelect',
                disclose:       'doEventItemDisclose'
            },
            eventsDetail: {
                updatedata:     'updateEventsData',
                activeitemchange:   'onTabChange',
                gotodetail:     'doEventItemMore'
            },
            eventsDetailMore: {
                tap:            'doEventItemMore'
            },
            eventsDetailNext: {
                tap:            'doEventItemNext'
            },
            eventsDetailPrev: {
                tap:            'doEventItemPrev'
            },
            eventsSelectFilter: {
                toggle:         'toggleEventsButtons'
            },
            favsOnlyButton: {
                tap:            'doFavsOnlyToggle'
            },
            eventsDayPrev: {
                tap:            'doEventsDayPrev'
            },
            eventsDayNext: {
                tap:            'doEventsDayNext'
            },
            setEventsDateTablet: {
                tap:            'doEventsDateTablet'
            },
            setEventsDatePhone: {
                tap:            'doEventsDatePhone'
            }
        }
    },

    hello: function(action) {
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl()))
            return;
        action.resume();
    },

    /**
     * @private
     *  showEventsList - handles route 'eventslist'
     *
     *    switch to eventsList card
     *
     */
    showEventsList: function() {
        this.log('showEventsList');
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) {
            if (!GayGuideApp.pendingRoute) {
                GayGuideApp.pendingRoute = 'eventslist';
            }
            return;
        }

        reportView('/touch/#events/', 'Events List: ' + Ext.Date.format(GayGuideApp.today, 'n/j/Y'));

        var target    = Ext.Viewport.down('slidenavigationview'),
            elistCard = GayGuideApp.cards.eventsList,
            statusBar = Ext.Viewport.down('#mainStatusBar'),
            sy = 0;
            
        target.list.deselectAll(true, true);
        target.list.select(0, false, true);
        target.afterActionCloseRequested(target);
        
        if (!target.container.down('#eventsList')) {
            if (!elistCard) {
                elistCard = this.createEventsList();
            }
            target.container.add(elistCard);
        }
        
        if (target.container.getActiveItem().getId() == 'eventsDetailContainer' ) {
            target.container.animateActiveItem(elistCard, { type: 'slide', direction: 'right' });
        }
        else {
            target.container.setActiveItem(elistCard);
        }
        statusBar && statusBar.clearAll().setCenter('Calendar for '+transDate(GayGuideApp.today));

        
        elistCard.fireEvent('favsshow', elistCard);
        this.toggleEventsButtons();
        
        Ext.callback(this.restoreEventsList, this, [], 150);
    },
    
    /**
     * @private
     * createEventsList - creates the events list container and list, reuses existing if found
     *   in events list view
     */
    createEventsList: function() {
        this.log('createEventsList','GayGuideApp.cards.eventsList is', !!GayGuideApp.cards.eventsList);
        
        var elistCard = Ext.getCmp('eventsListCard') || Ext.create(
            GayGuideApp.isTablet()
             ? 'GayGuideApp.view.tablet.EventsListTablet'
             : 'GayGuideApp.view.phone.PhoneEventsList',
            {
                id: 'eventsListCard'
            }
        );

        var store = GayGuideApp.store.eventsList || null;
        this.log('createEventsList','setting store to', store  && store.getStoreId());
        store && elistCard.down('list').setStore(store);

        GayGuideApp.cards.eventsList = elistCard;  //  eliminate this someday
        
        this.log('createEventsList','GayGuideApp.cards.eventsList is SET', elistCard.getId());
        return elistCard;
    },

    restoreEventsList: function() {
        this.log('restoreEventsList');
        var state = GayGuideApp.ggvstate && GayGuideApp.ggvstate['eventsListCard'];
        if (state) {

            GayGuideApp.cards.eventsList.down('segmentedbutton').setPressedButtons([state.filterset]);
            this.toggleEventsButtons();
            
            var list = GayGuideApp.cards.eventsList.down('list');

            if (Ext.isNumber(state.selectindex)) {
                var record = list.getStore().getRange(state.selectindex,state.selectindex)[0];
                list.appearSelected(record);
            }
            this.log('restoreEventsList', state.position);
            list._restorePending = true;            

            Ext.defer(function() {
                GayGuideApp.cards.eventsList.down('list')._restorePending = false;
                GayGuideApp.cards.eventsList.child('list').scrollToIndex(state.selectindex);
            }, 200, this);
        }
    },

    /**
     * @private
     *  showEventsId routes to eventsDetail card 'events/:id'
     *   @param {Number} id  The event id to be displayed.
     *
     */
    showEventsId: function(id) {
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport || !GayGuideApp.store.eventsList.isLoaded()) {
            this.pendingRoute = 'events/'+id;
            return;
        }
        if (!parseInt(id)) return;
        this.log('showEventsId',id);

        var me = GayGuideApp.cards.eventsList,
            store = GayGuideApp.store.eventsList,
            list  = me && me.down('list'),
            conf  = {}, record;

        var f = store.getFilters();
        store.clearFilter(true);
        record = store.findRecord('id', id, 0, false, false, true);
        store.setFilters(f);
        this.doEventItemSelect(list, record);
    },

    /**
     * @private
     *
     * doEventItemNext ' button handler for the "next event" button to load next item in event list
     *  @param {Object} me The button Object
     *
     */
    doEventItemNext: function(me) {
        this.log('doEventItemNext');
        var s = GayGuideApp.store.eventsList,
            c = GayGuideApp.cards.eventsDetail,
            count = s.indexOf(s.last()),
            x = GayGuideApp.cards.eventsDetail._ggv_selected;
        
        if (x < count) {
            this.doEventItemSelect(null, s.getAt(x+1));
            if (GayGuideApp.ggvstate['eventsListCard']) {
                GayGuideApp.ggvstate['eventsListCard'].selectindex = x+1;
            }
        }
        else {
            GayGuideApp.popups.noMoreInList.setHtml(Ux.locale.Manager.get( 'nav.msg.endlist', 'End of List'));
            GayGuideApp.popups.noMoreInList.showBy(me, 'tr-bc?');
        }
    },

    /**
     * @private
     *
     * doEventItemLast ' button handler for the "previous event" button to load previous item in event list
     *  @param {Object} me The button Object
     *
     */
    doEventItemPrev: function(me) {
        this.log('doEventItemPrev');
        var x = GayGuideApp.cards.eventsDetail._ggv_selected,
            s = GayGuideApp.store.eventsList;

        if (x > 0) {
            this.doEventItemSelect(null, s.getAt(x-1));
            if (GayGuideApp.ggvstate['eventsListCard']) {
                GayGuideApp.ggvstate['eventsListCard'].selectindex = x-1;
            }
        }
        else {
            GayGuideApp.popups.noMoreInList.setHtml(Ux.locale.Manager.get( 'nav.msg.toplist', 'Top of List'));
            GayGuideApp.popups.noMoreInList.showBy(me, 'tr-bc?');
        }
    },

    /**
     * @private
     *   doEventsItemDisclose:  to display the eventDetail selected
     *
     *   dispatch route to detail card
     *
     */
    doEventItemDisclose: function(me, record) {
        
        this.log('doEventItemDisclose');

        me.setDisableSelection(false);
        me.select(record, false, true);
        
        this.redirectTo('events/'+record.data.id);
    },

    /**
     * @private
     *   doEventItemMore:  button handler for the "More" button on the tabbar.  Dispatches to placesDetail card for the biz for this event
     *
     *   dispatch a route to detail card
     *
     */
    doEventItemMore: function(me) {
        this.log('doEventItemMore');

        var id = me.udata.business_id;

        this.redirectTo('eventbiz/'+id);
    },

    /**
     * @ private
     *
     *  doEventsDetailBack - tap handler for the back button on the eventsDetail Card
     *  @param {Object} me reference to the back button
     *
     */
    doEventsDetailBack: function (me) {
        this.log('doEventsDetailBack');
        this.getApplication().getHistory().back();
    },
    
    /**
     * doNavButton
     */
    doNavButton: function(me) {
        this.log('doNavButton');

        var x = me.up('slidenavigationview');

        Ext.callback(x.toggleContainer,x,[],0);
    },

    /**
     * doEventsDayPrev
     */
    doEventsDayPrev: function() {
                this.log('doEventsDayPrev');

        GayGuideApp.today.setDate(GayGuideApp.today.getDate()-1);
        GayGuideApp.ggv.getEvents(GayGuideApp.today);
    },

    /**
     * doEventsDayNext
     */
    doEventsDayNext: function() {
                this.log('doEventsDayNext');

        GayGuideApp.today.setDate(GayGuideApp.today.getDate()+1);
        GayGuideApp.ggv.getEvents(GayGuideApp.today);
    },

    /**
     * doEventsListShow
     */
    doEventsListShow: function(me) {
        if (!GayGuideApp.cards.viewport.container.down('#eventsListCard')) return;

        this.log('doEventsListShow');

        var card = GayGuideApp.cards.viewport.container.down('#eventsListCard'),
            button = card.down('toolbar > button[itemId="eventsFavsOnlyButton"]'),
            favsOnly = GayGuideApp.ggv.favsOnly; // app.isTablet() ? app.ggv.favsOnly: false;

        if (!button) return;

        if (favsOnly) {
            button.addCls('faved');
            GayGuideApp.popups.onlyFavsShowing.setHtml(Ux.locale.Manager.get( 'nav.msg.onlyfavslist', 'Only Favorites Showing'));
            Ext.defer(GayGuideApp.popups.onlyFavsShowing.showBy, 600, GayGuideApp.popups.onlyFavsShowing,  [button, 'tr-bc?']);
        }
        else {
            button.removeCls('faved');
        }
         this.log('doEventsListShow','end');
    },

    /**
     * doEventsListStart
     */
    doEventsListStart: function(me, event, eOpt) {
        var store = GayGuideApp.store.eventsList,
            e = me;
        this.log('doEventsListStart');

        if (store.isLoaded() && !me._ggv_needload) {
            e.deselectAll(true);
        }
        else {
            Ext.defer(GayGuideApp.ggv.getEvents, 1, this, [ GayGuideApp.today ]);
        }
    },

    /**
     * onTabChange
     */
    onTabChange: function(me, newitem, olditem) {
        this.log('onTabChange');
        var ctl = me.up('slidenavigationview'),
            data;
            
        if (Ext.isObject(newitem))
            data = newitem.getParent().udata;

        ctl && ctl.fireEvent('closerequest', ctl);

        if (data) {
            reportView('/touch/#events/'+data.id+'/'+newitem.getItemId(), newitem.getItemId()+' : '+data.list_name+' : '+data.nameEvent);
        }
    },

    /**
     * doFavsOnlyToggle
     */
    doFavsOnlyToggle: function(me) {
        this.log('doFavsOnlyToggle');
        var mappanel = GayGuideApp.cards.viewport.container.down('mappanel');

        if (GayGuideApp.ggv.favsOnly) {
            GayGuideApp.ggv.favsOnly = false;
            me.removeCls('faved');
        }
        else {
            GayGuideApp.ggv.favsOnly = true;
            me.addCls('faved');
        }

        GayGuideApp.ggv.markerDirty = true;
        this.toggleEventsButtons();
        me.getParent().getParent().fireEvent('showEventsList');
    },

    /**
     * doEventsDatePhone
     */
    doEventsDatePhone: function () {
        this.log('doEventsDatePhone');

        var picker = Ext.create('Ext.picker.Date', {

            useTitles: false,
            masked:    false,
            hidden:    false,
            cls:       'ggv-base',
            value:     GayGuideApp.today,
            slotOrder: ['day', 'month', 'year'],
            yearFrom:  2013,
            yearTo:    2015,

            listeners: {
                order:  'after',
                change: function(picker, values) {
                    GayGuideApp.today = values;
                    GayGuideApp.ggv.getEvents(values);
                    picker.destroy();
                },
                cancel: function(picker) {
                    picker.destroy();
                }
            }
        });

        picker.setDoneButton(Ux.locale.Manager.get('buttons.done'));
        picker.setCancelButton(Ux.locale.Manager.get('buttons.cancel'));
        picker.setValue(GayGuideApp.today);
        Ext.Viewport.add(picker);
    },

    /**
     * doEventsDateTablet
     */
    doEventsDateTablet: function (me) {
        this.log('doEventsDateTablet');

        var picker = Ext.create('Ux.datepicker.DatePicker', {
            hidden:        false,
            centered:      true,
            modal:         true,
            masked:        true,
            hideOnMaskTap: true,
            fullscreen:    false,
            width:         500,
            minWidth:      '400',
            value:         new Date(),

            listeners: {
                order:  'after',
                change: function(picker, values) {
                    GayGuideApp.today = values;
                    GayGuideApp.ggv.getEvents(values);
                    picker.hide();
                },
                hide:   function(picker) {
                    picker.destroy();
                }
            }
        });

        picker.setValue(GayGuideApp.today);
        Ext.Viewport.add(picker);
    },
    
    /**
     * doEventItemSelect:  to display the eventDetail selected
     */
    doEventItemSelect: function(me, record) {
        this.log('doEventItemSelect');
        var target = GayGuideApp.cards.viewport.container,
            statusBar = Ext.Viewport.down('#mainStatusBar'),
            s = GayGuideApp.store.eventsList,
            v = GayGuideApp.isTablet()
                  ?'GayGuideApp.view.tablet.EventsDetailContainer'
                  :'GayGuideApp.view.phone.EventsDetailContainer';

        if (record) {
            var card = GayGuideApp.cards.eventsDetail = GayGuideApp.cards.eventsDetail || Ext.create(v, {});
            Ux.locale.Manager.applyLocales('eventsdetailcontainer');

            var eventsTabPanel = GayGuideApp.cards.eventsDetail.down('tabpanel');
            var index = s.indexOf(record);
            GayGuideApp.cards.eventsDetail._ggv_selected = index;
            
            if (card.down('#eventMap')) {
                if (GayGuideApp.ggv.gps != 'off') {
                   card.down('#eventMap').setCacheFitBounds(true);
                   card.down('#eventMap').setCenter(false);
                   card.down('#eventMap').setCacheLocation(true);
                   card.down('#eventMap').setCacheDirections(GayGuideApp.ggv.directions != 'off');
                }
                else {
                   card.down('#eventMap').setCacheFitBounds(false);
                   card.down('#eventMap').setCenter(true);
                   card.down('#eventMap').setZoom(15);
                   card.down('#eventMap').setCacheDirections(false);
                }
            }

            eventsTabPanel.setData(record.data);
            
            if (GayGuideApp.isCordova()) {
                
                if (GayGuideApp.ggv.calendarEnabled) {

                    GayGuideApp.ggv.chkCalendarEntry(record,
                        function(isTrue) {
                            var x = document.getElementById('addCal');
                            
                            if (isTrue) {
                                x.innerHTML = "CURRENTLY IN YOUR CALENDAR";
                                x.style.background = "#336";
                                x.style.color = "#fff";
                            }
                            x.style.display = "block";
                        },
                        function(message) {
                            alert('Cannot Access Calendar.  Enable access for GayGuideApp in Settings > Privacy > Calendars');
                            GayGuideApp.ggv.calendarEnabled = false;
                            createCookie('calendarAccess', 'off', 0, 300 );
                        });
                }
                else {
                    Ext.defer(function() {
                        var x = document.getElementById('addCal');
                        if (x) x.style.display = "block";
                    }, 10, this);
                }
            }

            eventsTabPanel.down('#eventsDetailToolbar').setTitle(
                GayGuideApp.isTablet()
                ? transDate(GayGuideApp.today) + ' &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp; '    + record.data.list_name + ' > ' + record.data.catnameEvent+ ' > ' + record.data.nameEvent
                : '');
            
            statusBar && statusBar.clearAll();
            statusBar && statusBar.setCenter(transDate(GayGuideApp.today) + ' &nbsp;:&nbsp; ' + record.data.nameEvent );

            if ((target.getActiveItem().getItemId()) == 'eventslist') {
                eventsTabPanel.setActiveItem(0);
            }

            reportView('/touch/#events/'+ (record.data.id) + '/' +  eventsTabPanel.getActiveItem().getItemId(),
                eventsTabPanel.getActiveItem().getItemId() + ' : ' + record.data.list_name + ' : ' + record.data.nameEvent);
            
            s = (target.getActiveItem() == GayGuideApp.cards.placesDetail);
            if (target.getActiveItem() != GayGuideApp.cards.eventsDetail) {
                target.animateActiveItem(GayGuideApp.cards.eventsDetail, {
                    type: 'slide',
                    direction:  s  ?'right':'left'
                });
            }
        }
        else
            this.log('doEventItemSelect', 'no record');
    },
    
    /**
     * toggleEventsButtons
     */
    toggleEventsButtons: function (me, button, isPressed, eOpts) {
        this.log('toggleEventsButtons', !!me, isPressed);

        if (isPressed === false) return;

        var list = GayGuideApp.cards.viewport.container.down('#eventsList'),
            card = GayGuideApp.cards.viewport.container.down('#eventsListCard'),
            c;

        if (!list || list._restorePending) return;
        c = card.down('segmentedbutton');
        if (!c) return;

        var buttons = c.query('button'),
            allButtonIndex = GayGuideApp.isTablet()?4:2,
            favsOnly = GayGuideApp.isTablet() ? GayGuideApp.ggv.favsOnly : false,
            filterGroups = [], i;
            
        if (!GayGuideApp.store.eventsList) {
            return;
        }
        
        list.getScrollable().getScroller().scrollTo(0, 1);
        list.getScrollable().getScroller().scrollTo(0, 0);
        
        if (c.isPressed(buttons[allButtonIndex])) {
            GayGuideApp.store.eventsList.clearFilter(true);
            if(favsOnly)
                GayGuideApp.store.eventsList.filter('fav', 1);

            GayGuideApp.store.eventsList.setGrouper({
                groupFn: function(record) {
                    return trans('allEventsSortedByTime');
                }
            });
            GayGuideApp.store.eventsList.sort([{
                property:  'minutes_into_day',
                root:      'data',
                direction: 'ASC'
            }], 'ASC');
        }
        
        else {
            var j = GayGuideApp.isTablet()?[[0],[1],[2],[3],[-1]]:[[0,1,2],[3],[-1]];

            for(i=0; i<allButtonIndex && i<buttons.length; i++) {
                if (c.isPressed(buttons[i])) {
                    j[i].forEach(function(j) {
                        filterGroups.push(j);
                    });
                }
            }

            if (GayGuideApp.store.eventsList) {
                GayGuideApp.store.eventsList.clearFilter(true);
                GayGuideApp.store.eventsList.setGrouper({
                    groupFn: function(record) {
                        return record.get('eventList');
                    },
                    sortProperty: 'listOrder'
                });

                if(favsOnly) {
                    GayGuideApp.store.eventsList.filter('fav', 1);
                }

                GayGuideApp.store.eventsList.filterBy( function(record, id) {
                    return filterGroups.indexOf(record.get('listGroup')) != -1;
                });

                GayGuideApp.store.eventsList.sort([{
                    property: 'listOrder',
                    direction: 'ASC',
                    root: 'data'
                },{
                    property: 'minutes_into_day',
                    direction: 'ASC',
                    root: 'data'
                },{
                    property: 'nameEvent',
                    direction: 'ASC',
                    root: 'data'
                }], 'ASC');
            }
        }
        list.refresh();

        //try to scroll to current time
        //
        if (c.isPressed(buttons[allButtonIndex]) ) {
            var store = list.getStore(),
                time, x=0, idx,
                now = new Date();

            if (!list.getItemHeight()) return; 
            this.log('toggleEventsButtons', 'trying to move forward to current time');

            if ((now.getDay()   == GayGuideApp.today.getDay())
             && (now.getMonth() == GayGuideApp.today.getMonth())
             && (now.getYear()  == GayGuideApp.today.getYear())) {

                time = now.getHours()*60 + now.getMinutes();
                store.each(function(record, index, length) {
                    idx = index;
                    return (record.data.minutes_into_day < time);
                });
                Ext.defer(function() {
                    list.scrollToIndex(idx, 30);
                }, 200, this);
            }
        }
    },
    
    /**
     * onEventsLoad
     */
    onEventsLoad: function(loadstore, records, success, operation, eOpts) {
        var app     = GayGuideApp,
            store   = loadstore,
            list    = app.cards.eventsList && app.cards.eventsList.down('list'),
            control = app.app.getController('EventsController');
        
        if (!success) {
            Ext.Msg.confirm('Gay Guide Vallarta', 'events calendar load failed<br />Try Again?', function(value) {
                if (value == 'yes') {
                    var tmo = store.getProxy().getTimeout()+1000;
                    store.getProxy().setTimeout( tmo );
                    store.load();
                    Ext.Viewport.setMasked(app.ggv.loadMask);
                }
            });
            Ext.Viewport.setMasked(false);
        }

        app.SunsetTimeValue = false;
        Ext.Array.each(records, function(item) {
            app.SunsetTimeValue = item.data.sunsetTime;
        });

        app.store.eventsStore = store;
        app.store.eventsList = store.getView('eventsList');
        if (!app.store.eventsList) {
            app.store.eventsList = store.addView({
                name: 'eventsList',
                filterFn: function(item) { return true; }
            }).store;

            app.store.eventsList.setGroupField('eventList');
            app.store.eventsList.setGroupDir('ASC');
            app.store.eventsList.setGrouper({
                groupFn: function(record) {
                    return record.get('eventList');
                },
                sortProperty: 'listOrder'
            }),

            app.store.eventsList.setSorters([{
                property: 'listOrder',
                direction: 'ASC',
                root: 'data'
            },{
                property: 'minutes_into_day',
                direction: 'ASC',
                root: 'data'
            },{
                property: 'nameEvent',
                direction: 'ASC',
                root: 'data'
            }]);
        }
        list && app.store.eventsList && list.setStore(app.store.eventsList);
        //list && list.refresh();

        //store.clearFilter(false);
        store.each(function(item) {
            if (item.data.business_id) {
                var x = app.store.favorites.findRecord('bid', item.data.business_id, 0, false, false, true);
                x && x.data.fav && item.set('fav', 1);
            }
        });
        control.log('onEventsLoad', 'store updated with favs info');
        if (Ext.Viewport.down('#MainContainer').getActiveItem().getItemId() == 'eventsListCard') {
            var statusBar = Ext.Viewport.down('#mainStatusBar')
            statusBar && statusBar.clearAll().setCenter('Calendar for '+transDate(app.today));
        }
        control.toggleEventsButtons();
        
        if (Ext.getStore('mainstore').getCount()) {
            Ext.Viewport.setMasked(false);
        }

        if (control.pendingRoute) {
            var x = control.pendingRoute;

            control.pendingRoute = null;
            app.app.getApplication().redirectTo(x);  //?????
        }
    },
    
    log: function() {
        var args = Array.prototype.slice.call(arguments);
        //args.unshift(new Date().getTime()/1000);
        args.unshift('EventsController')
        if (this.getDebug())
            console.log( args);
    }
});

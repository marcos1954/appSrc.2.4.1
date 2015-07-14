/**
 * GayGuideApp.controller.DetailController
 *     handles the placesDetail card
 *
 *   controls both phone and tablet views
 *
 *   The data can be loaded before activating this card by firing an event (loadPlacesDetail) on the placesDetail card
 *
 *   Includes several private methods to respond to button and tab changes on placesDetail card
 *
 */
Ext.define("GayGuideApp.controller.DetailController", {
    extend: "Ext.app.Controller",

    requires: ['Ext.Button', 'Ext.List', 'Ext.tab.Panel', 'Ext.Map'],

    config: {
        debug: false,
        
        before: {
            'showPlacesListId':  'hello',
            'showFavsListId':    'hello',
            'showNotesListId':   'hello',
            'showMapId':         'hello',
            'showEventBizId':    'hello',
            'showGalleryBizId':  'hello',
            'showRecentsListId': 'hello',
            'showSearchId':      'hello',
            'showNearId':        'hello',
            'showOverviewId':    'hello',
            'showCatGroupId':    'hello',
            'showCatSubgroupId': 'hello',
            'showCuisinesId':    'hello',
            'showCharacteristicsId': 'hello'
        },
        
        routes: {
            'places/:id':        'showPlacesListId',
            'favs/:id':          'showFavsListId',
            'notes/:id':         'showNotesListId',
            'map/:id':           'showMapId',
            'eventbiz/:id':      'showEventBizId',
            'gallerybiz/:id':    'showGalleryBizId',
            'recents/:id':       'showRecentsListId',
            'taglist/:id':       'showTagListId',
            'search/:id':        'showSearchId',
            'nearby/:id':        'showNearId',
            'overview/:id':      'showOverviewId',
            'catgroup/:id':      'showCatGroupId',
            'catsubgroup/:id':   'showCatSubgroupId',
            'characteristics/:id': 'showCharacteristicsId',
            'cuisines/:id':      'showCuisinesId'
        },

        refs: {
            detailData:          'tabpanel[itemId="placesDetail"]',
            detailBack:          '#placesDetail #backButton',
            altBack:             '#placesDetail #altBack',
            starButtons:         '#placesDetail button[iconCls="flag"]',
            nextItem:            '#placesDetail button[iconCls="next"]',
            lastItem:            '#placesDetail button[iconCls="last"]',
            flagButtons:         '#placesDetail button[iconCls="compose2"]',
            detailNotesDone:     'notes > titlebar  button[itemId="notesDone"]'
        },

        control: {
            detailBack: {
                tap: 'doBack'
            },
            altBack: {
                tap: 'doBack'
            },
            nextItem: {
                tap: 'doItemNext'
            },
            lastItem: {
                tap: 'doItemLast'
            },
            starButtons: {
                tap: 'toggleFavorite'
            },
            flagButtons: {
                tap: 'doNotes'
            },
            detailNotesDone: {
                tap: 'doNotesDone'
            },
            detailData: {
                loadPlacesDetail: 'loadPlacesDetail',
                updatedata:       'updateData',
                activeitemchange: 'onTabChange'
            }
        }
    },
     
    /**
     * @private
     *  
     *  @param {Object} action The route class
     *
     */ 
    hello: function(action) {
        ggv_log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    /**
     * @private
     *  dispatchToPlacesDetail - The common router handler for all routes that lead to a placesDetail card.
     *
     * example conf:
     * <pre><code>
     *  conf = {
     *      _ggv_selected: null,
     *      _ggv_store:   GayGuideApp.store && GayGuideApp.store.placesList,
     *      _ggv_list:     null,
     *      _ggv_OptContainer: null,
     *      _ggv_last:     Ext.Viewport.down('#eventsDetail').getParent(),
     *      _ggv_route:    'eventbiz/'+id
     *  };
     *
     * </code></pre>
     *  @param {Number} id
     *  @param {Object} conf - configuration object for the route
     *
     */
    dispatchToLoadPlacesDetail: function(id, conf) {
        if (!parseInt(id)) return;
        this.log('dispatchToPlacesDetail', id, conf);
        var store = conf._ggv_store, 
            card = GayGuideApp.cards.placesDetail,
            filters,
            record;

        if (!store) return;
        
        filters = store.getFilters();
        if (filters.length) store.clearFilter(true);
        record = store.findRecord('id', id, 0, false, false, true);
        if (filters.length) store.setFilters(filters);

        if (record) {
            if (conf._ggv_store) {
                conf._ggv_selected = conf._ggv_store.indexOf(record)
            }
            this.loadPlacesDetail(conf._last, record, conf)
        }
    },

    dispatchById: function(cardname, listname, route, id, storename) {
        this.log('dispatchById', cardname, listname, route, id, storename);
        var view  = Ext.Viewport.down(cardname);
        
        var list  = listname && view && GayGuideApp.cards.viewport.container.down(listname),
            store = list && list.getStore();
            
        if (Ext.isString(storename) ) store = Ext.StoreManager.get(storename);
        else if (Ext.isObject(storename))  store = storename;
            
        this.dispatchToLoadPlacesDetail(id, {
            _ggv_selected: null,
            _ggv_store: store,
            _ggv_list:  list,
            _ggv_OptContainer: view,
            _ggv_last: view,
            _ggv_route: route + '/' + id,
            _ggv_id: id
        });
    },
    
    showOverviewId: function(id) {
        this.log('showOverviewId', id);
        this.dispatchById('#browseCard', '#groupedPlist', 'overview', id);
    },
      
    showCatGroupId: function(id) {
        this.log('showCatGroupId', id);
        this.dispatchById('#browseCard', '#groupedPlist', 'catgroup', id);
    },
   
    showCatSubgroupId: function(id) { 
        this.log('showCatSubgroupId', id); 
        this.dispatchById('#browseCard', '#ungroupedPlist', 'catsubgroup', id);
    },

    showCharacteristicsId: function(id) {
        this.log('showCharacteristicsId', id);
        this.dispatchById('#browseCard', '#groupedPlist', 'characteristics', id);
    },

    showCuisinesId: function(id) {
        this.log('showCuisinesId', id);
        this.dispatchById('#browseCard', '#groupedPlist', 'cuisines', id);
    },

    showSearchId: function(id) {
        this.log('showSearchId', id);
        this.dispatchById('#browseCard', null,  'search', id, GayGuideApp.store.sList);
    },

    showFavsListId: function(id) {
        this.log('showFavsListId', id);
        this.dispatchById('#favsList', '#favsList',  'favs', id, GayGuideApp.store.favoritesList);
    },

    showNotesListId: function(id) {
        this.log('showNotesListId', id);
        this.dispatchById('#notesList', '#notesList',  'notes', id, GayGuideApp.store.favoritesList);
    },

    showPlacesListId: function(id) {
        this.log('showPlacesListId', id);
        this.dispatchById('#placesListCard', 'list',  'places', id, GayGuideApp.store.placesList);
    },

    showMapId: function(id) {
        this.log('showMapId', id);
        this.dispatchById('#MapContainer', null,  'map', id, Ext.getStore('mainstore') /*GayGuideApp.store.placesList*/ );
    },

    showEventBizId: function(id) {
        this.log('showEventBizId', id);
        this.dispatchById('#eventsDetailContainer', null,  'eventbiz', id, Ext.getStore('mainstore') /*GayGuideApp.store.placesList*/);
    },

    showGalleryBizId: function(id) {
        this.log('showGalleryBizId', id);
        this.dispatchById('#GalleryContainer', null,  'gallerybiz', id, Ext.getStore('mainstore') /*GayGuideApp.store.placesList*/);
    },

    showRecentsListId: function(id) {
        this.log('showRecentsListId', id);
        this.dispatchById('#RecentsContainer', 'list',  'recents', id, GayGuideApp.store.recentsStore);
    },

    showNearId: function(id) {
        this.log('showNearId', id);
        this.dispatchById('#browseCard', null,  'nearby', id, GayGuideApp.store.nList);
    },

    /**
     * @private
     *
     * respond to 'activeitemchange' event in tabpanel
     *
     *    default is to close slide nav container on any tabchange
     *
     */
    onTabChange: function(me, newitem, olditem) {
        this.log('onTabChange', 'recording tab visit for google analytics');
        var ctl  = me.up('slidenavigationview'),
            data = newitem && newitem.getParent().udata;

        if (ctl) {
            ctl.fireEvent('closerequest', ctl);
        }

        if (data) {
            reportView('/touch/#places/' + (data.id) + '/' + newitem.getComponent(0).getItemId(), newitem.getComponent(0).getItemId() + ' : ' + data.list_name);
        }
    },

    /**
     * @private
     *
     * respond to 'tap' event on the back button
     *
     *    executes history.back()
     *
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doBack: function(me, e, eOpts) {
        this.log('doBack', 'start');
        this.getApplication().getHistory().back();
    },

    /**
     * @private
     *
     *  respond to "next" button tap. Loads into the view the next record in the current store
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doItemNext: function(me, e, eOpts) {
        this.log('doItemNext', !me.up('#placesDetail')._ggv_list);
        if (!me.up('#placesDetail')._ggv_list) return true;

        var m = GayGuideApp.popups.noMoreInList,
            p = me.up('#placesDetail'),
            x = p._ggv_selected,
            l = p._ggv_list,
            oc = p._ggv_OptContainer,
            st = p._ggv_store,
            c = st.getCount() - 1,
            conf = {
                _ggv_scrollTo: null,
                _ggv_selected: x + 1,
                _ggv_store: st,
                _ggv_list: l,
                _ggv_OptContainer: oc,
                _ggv_last: p._ggv_last
            };
         
        this.log('doItemNext', conf);
        if (x < c) {
            this.loadPlacesDetail(p, st.getAt(x + 1), conf);
            
            if (GayGuideApp.ggvstate) {
                ['placesList','favsList','notesList'].forEach(function(item) {
                    if (GayGuideApp.ggvstate[item]) {
                        GayGuideApp.ggvstate[item].selectindex = x+1;
                    }               
                });
                if (GayGuideApp.ggvstate['browseCard']) {
                    GayGuideApp.ggvstate['browseCard'].rightSelectIndices = [x+1];
                }
            }
        } else {
            m.setHtml(Ux.locale.Manager.get('nav.msg.endlist', 'End of List'));
            m.showBy(me, 'tr-bc?');
        }
        return true;
    },

    /**
     * @private
     *
     *  respond to "last" button tap. Loads into the view the previous record in the current store
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doItemLast: function(me, e, eOpts) {
        this.log('doItemLast');
        if (!me.up('#placesDetail')._ggv_list) return true;

        var m = GayGuideApp.popups.noMoreInList,
            p = me.up('#placesDetail'),
            x = p._ggv_selected,
            l = p._ggv_list,
            oc = p._ggv_OptContainer,
            st = p._ggv_store,
            conf = {
                _ggv_scrollTo: null,
                _ggv_selected: x-1,
                _ggv_store: st,
                _ggv_list: l,
                _ggv_OptContainer: oc,
                _ggv_last: p._ggv_last
            };

        this.log('doItemLast', conf);
        if (x > 0) {
            this.loadPlacesDetail(p, st.getAt(x - 1), conf);
            if (GayGuideApp.ggvstate) {
                ['placesList','favsList','notesList'].forEach(function(item) {
                    if (GayGuideApp.ggvstate[item]) {
                        GayGuideApp.ggvstate[item].selectindex = x-1;
                    }               
                });
                if (GayGuideApp.ggvstate['browseCard']) {
                    GayGuideApp.ggvstate['browseCard'].rightSelectIndices = [x-1];
                }
            }
        } else {
            m.setHtml(Ux.locale.Manager.get('nav.msg.toplist', 'Top of List'));
            m.showBy(me, 'tr-bc?');
        }
        return true;
    },

    /**
     * @private
     *   respond to notes button press
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doNotes: function(me, e, eOpts) {
        this.log('doNotes');

        var store = GayGuideApp.store.favorites,
            bid = GayGuideApp.cards.placesDetail.down('tabpanel').udata.id,
            r = store.findRecord('bid', bid, 0, false, false, true);

        GayGuideApp.popups.notes = GayGuideApp.popups.notes || Ext.create(GayGuideApp.view.tablet.Notes);
        if (!GayGuideApp.isTablet()) {
            GayGuideApp.popups.notes.setWidth('95%');
        }
        if (!Ext.Viewport.down('notes')) {
            Ext.Viewport.add(GayGuideApp.popups.notes);
        }
        GayGuideApp.popups.notes.query('textareafield')[0].setValue(r ? r.data.notes : '');
        GayGuideApp.popups.notes.showBy(me, 'tr-bc?');
    },

    /**
     * @private
     *   respond to Done button on notes popup
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doNotesDone: function(me, e, eOpts) {
        this.log('doNotesDone');

        var store = GayGuideApp.store.favorites,
            bid = GayGuideApp.cards.placesDetail.down('tabpanel').udata.id,
            r = store.findRecord('bid', bid, 0, false, false, true),
            r1, notes = me.up('notes').down('textareafield').getValue();

        if (!r) {
            r = store.add({
                bid: bid.toString(),
                something: GayGuideApp.cards.placesDetail.down('tabpanel').udata.list_name,
                fav: 0,
                notes: '',
                junk: Math.random().toString()
            })[0];
        }
        r.set('notes', notes);
        store.sync();

        store = Ext.getStore('mainstore') /*GayGuideApp.store.placesList*/ ;
        
        var f = store.getFilters();
        if (f.length) {
            console.log('mainstore is filtered!');
            store.clearFilter();
        }
        ///////
        r = store.findRecord('id', bid, 0, false, false, true);
        store.setFilters(f);

        r.set('notes', notes);
        GayGuideApp.cards.placesDetail.down('tabpanel').setData(r);

        store = GayGuideApp.store.favoritesList;
        r1 = store.findRecord('id', bid, 0, false, false, true);
        if (r1) {
            r1.set('notes', notes);
        } else {
            store.add(r);
        }

        store = GayGuideApp.store.recentsStore;
        r1 = store && store.findRecord('id', bid, 0, false, false, true);
        if (r1) {
            r1.set('notes', notes);
        }

        if (notes != '') {
            GayGuideApp.cards.placesDetail.down('button[iconCls="compose2"]').setCls('faved');
        } else {
            GayGuideApp.cards.placesDetail.down('button[iconCls="compose2"]').removeCls('faved');
        }
    },

    /**
     * @private
     *   respond to favsButton press
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    toggleFavorite: function(me, e, eOpts) {
        this.log('toggleFavorite');

        var card = me.up('#placesDetail'),
            data = card.udata,
            bid = data.id,
            store = GayGuideApp.store.favorites,
            mainstore = Ext.getStore('mainstore'),
            m = GayGuideApp.popups.onlyFavsShowing,
            item, r, rr;

        if (!data) return true;

        if (bid) {
            item = store.findRecord('bid', bid, 0, false, false, true);
            var flr = GayGuideApp.store.favoritesList.findRecord('id', bid, 0, false, false, true);
            if (card._ggv_last != GayGuideApp.cards.placesList) {
                mainstore.clearFilter(true);
            }

            r = mainstore.findRecord('id', bid, 0, false, false, true);
            rr = GayGuideApp.store.recentsStore && GayGuideApp.store.recentsStore.findRecord('id', bid, 0, false, false, true);
            if (!item || !item.data.fav) {
                GayGuideApp.cards.viewport.query('button[iconCls="flag"]').forEach(function(item) {
                    item.addCls('faved');
                });

                r.set('fav', 1);
                rr && rr.set('fav', 1);
                if (!flr) {
                    GayGuideApp.store.favoritesList.add(r);
                } else {
                    flr.set('fav', 1);
                }

                if (item) {
                    item.set('fav', 1);
                } else {
                    item = store.add({
                        bid:       bid.toString(),
                        something: r.data.list_name,
                        fav:       1,
                        notes:     '',
                        junk:      Math.random().toString()
                    })[0];
                }

                GayGuideApp.ggv.setMarkerFavs(bid, true);

                m.setHtml(Ux.locale.Manager.get('nav.msg.addfavslist', 'Added to your Favorites'));
            }
            else {
                GayGuideApp.cards.viewport.query('button[iconCls="flag"]').forEach(function(item) {
                    item.removeCls('faved');
                });
                r.set('fav', 0);
                rr && rr.set('fav', 0);
                item.set('fav', 0);
                flr && flr.set('fav', 0);

                GayGuideApp.ggv.setMarkerFavs(bid, false);

                m.setHtml(Ux.locale.Manager.get('nav.msg.removefavslist', 'Removed from your Favorites'));
            }
            if (GayGuideApp.ggvstate) { GayGuideApp.ggvstate['favsList'] = null; }
            store.sync();

            GayGuideApp.store.eventsList.clearFilter(false);
            GayGuideApp.store.eventsList.each(function(elistitem) {
                if (item.data.bid == elistitem.data.business_id) {
                    elistitem.set('fav', (item && item.data.fav) ? 1 : 0)
                }
            });

            m.showBy(me, 'tr-bc?');
        }
        return true;
    },

    /**
     * Loads new record into placesDetail view
     *
     * This can be called direcly or you can fire a loadPlacesDetail event on placesDetail view
     *
     *   @param {Ext.List} me The button that was pressed.
     *   @param {Ext.data.Model} record The record to be loaded.
     *   @param {object} conf The conf info for restoring previous view card (usually a list)
     *
     */
    loadPlacesDetail: function(me, record, conf) {
        this.log('loadPlacesDetail', record.data.id);

        var target = Ext.Viewport.down('#MainContainer'),
            statusBar = Ext.Viewport.down('#mainStatusBar'),
            store = Ext.getStore('mainstore'), // GayGuideApp.store.placesList,
            card,
            r = record;

        if (record) {
            if (!GayGuideApp.cards.placesDetail) {
                this.log('loadPlacesDetail', 'creating placesDetailContainer', record.data.id);
                
                var viewname = GayGuideApp.isTablet()
                    ? 'GayGuideApp.view.tablet.PlacesDetailContainer'
                    : 'GayGuideApp.view.phone.PlacesDetailContainer';
                    
                card = GayGuideApp.cards.placesDetail = Ext.create(viewname, { id: 'placesDetailContainer' });
                card.onActivate && card.onActivate(card);

                
                GayGuideApp.isTablet() && GayGuideApp.cards.placesDetail.down('placesphotobar').element.on({
                    tap: this.photoTapHandler,
                    delegate: 'img'
                });
            }
            card = GayGuideApp.cards.placesDetail.down('tabpanel');
            
            // change map settings to match current gps settings
            //
            if (card.down('#detailMap')) {

                if (GayGuideApp.ggv.gps != 'off') {
                    card.down('#detailMap').setCacheFitBounds(true);
                    card.down('#detailMap').setCenter(false);
                    card.down('#detailMap').setCacheLocation(true);
                    card.down('#detailMap').setCacheDirections(GayGuideApp.ggv.directions != 'off');
                }
                else {
                    card.down('#detailMap').setCacheFitBounds(false);
                    card.down('#detailMap').setCenter(true);
                    card.down('#detailMap').setZoom(15);
                    card.down('#detailMap').setCacheLocation(false);
                    card.down('#detailMap').setCacheDirections(false);
                }
            }

            card._ggv_selected = conf._ggv_selected;
            card._ggv_store = conf._ggv_store;
            card._ggv_list = conf._ggv_list;
            card._ggv_last = conf._ggv_last;
            card._ggv_scrollTo = conf._ggv_scrollTo;

            var toolbar = card.down('statusbar');

            card.scrollToTop(card);
            card.udata = r.data;
            card.setData(r);

            card.fireEvent('sizechange', card, Ext.Viewport.getWindowWidth(), Ext.Viewport.getWindowHeight());

            statusBar && statusBar.setRight(record.data.list_name);
            statusBar && statusBar.setCenter('');

            
            
            if (GayGuideApp.isTablet()) {
                toolbar.setStatus(
                    '&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;',
                    record.data.list_name, card._ggv_list
                        ? (Ux.locale.Manager.get("navlist.group.favorites", "My Gay PV")+'&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
                        : Ux.locale.Manager.get("misc.myGayPV", "My Gay PV")
                    );
            }
            
            Ux.locale.Manager.applyLocales('placesdetail');
            if (target.getActiveItem().getItemId() != "placesDetailContainer") {
                card.setActiveItem(0);
            }

            target.animateActiveItem(card.getParent(), {
                type: 'slide',
                direction: 'left'
            });
            this.logViewVist(r.data.id, r.data.name);
        }
    },

    /**
     *
     *
     */
    logViewVist: Ext.Function.createBuffered(function(id, name) {
        reportView('/touch/#places/' + (id) );
        //GayGuideApp.ggv.logRecentVisit(id, name);
    }, 3000),

    /**
     * @private
     *
     *   respond to updatedata event on placesDetail card
     *
     *      Note: updatedata event is fired by default setData() on this view (placesDetail)
     *
     *   @param {GayGuideApp.view.tablet.PlacesDetail|GayGuideApp.view.phone.DetailPhone} c The placesDetail card.
     *   @param {Ext.data.Model} record The record to be loaded.
     *
     */
    updateData: function(c, record) {
        this.log('updateData', record.data.id);
        var ctl = this,
            data = record.getData(),
            star = c.query('button[iconCls="flag"]'),
            compose = c.query('button[iconCls="compose2"]'),
            maptab = GayGuideApp.isTablet() ? 4 : 3,
            f, events = [];

        // collect events associated, and then place data into all the views and subviews needed
        //
        Ext.each(record.events().getRange(0), function(model, index) {
            events.push(model.getData());
        });
        c.udata = data;
        c.udata.eventArray = events;  //!! do we need to clean this up later?
        Ext.each(c.getInnerItems(), function(v) {
            v.items.items[0].setData(c.udata);
        });
        this.updatePhotoRecords(c, data);
        //  set button attributes for this data record
        //
        f = GayGuideApp.store.favorites.findRecord('bid', record.data.id, 0, false, false, true);
        this.setButtonClass('faved', compose, !(f && f.data.notes != ''));
        this.setButtonClass('faved', star, !record.data.fav);
        this.setButtonClass('ggv-empty', c.getTabBar().getComponent(maptab), (data.list_latitude && data.list_latitude != "false"));
        this.setButtonClass('ggv-empty', c.getTabBar().getComponent(2), events.length);
        if (GayGuideApp.isTablet()) {
            var m = c.getTabBar().getComponent(3);
            var hasItems = ctl.setCarousel(c.down('#placesMenu'), 8, 'data.list_menu_pix', data);
            this.setButtonClass('ggv-empty', m, hasItems);
        }
    },
    
    /**
     *
     */
    setButtonClass: function(cls, button, state) {        
        if (!Ext.isArray(button))
            button = [ button ];

        button.forEach(function(i) {
            if (state) i.removeCls(cls);
            else       i.setCls(cls);
        });
    },

    /**
     * @private
     *
     *  update photo records in carousel tab
     *
     *   @param {GayGuideApp.view.tablet.PlacesDetail|GayGuideApp.view.phone.DetailPhone} c The placesDetail card.
     *   @param {Ext.data.Model} record The record to be loaded.
     */
    updatePhotoRecords: function(c, data) {
        this.log('updatePhotoRecords', data.id);

        var x = this.setCarousel(c.down('#Photo'), 9, 'data.list_pix', data),
            m = c.getTabBar().getComponent(1);
   
        this.setButtonClass('ggv-empty', m, !!x);
    },

    /**
     * @private
     *
     *  loads pix from data part of a record into pinchzoom carousel
     *
     *   field names are in the form field_prefix1, field_prefix2, ...
     *
     *  @param {Ux.pinchzoom.ImageCarousel} me
     *  @param {Number} max number of pix fields in the record
     *  @param {String} field_prefix Prefix string to generate field names
     *  @param {object} data Data object from record (model instance)
     *
     */
    setCarousel: function(me, max, field_prefix, data) {
        this.log('setCarousel', data.id);
        var i, j, items = [];

        me.removeAll(true, false);
        for (i = 1; i <= max; i++) {
            j = eval(field_prefix + i);
            if (j) {
                items.push({
                    xtype: 'imageviewer',
                    style: {
                        backgroundColor: '#333'
                    },
                    imageSrc: 'http://www.gayguidevallarta.com/img.io/timthumb.php?' + (GayGuideApp.isTablet() ? 'w=1024' : 'w=600&') + '&src=' + j.replace('http://www.gayguidevallarta.com',''),
                    layout: 'fit',
                    loadingMessage: Ux.locale.Manager.get("misc.loadLocaleMsg", "Loading ..."),
                    errorImage: 'resources/images/NoImage.png'
                });
            }
        }
        j = items.length;
        if (!j) {
            items.push({
                xtype: 'container',
                layout: 'fit',
                html: GayGuideApp.isTablet()
                    ?'<div style="background-color: #333; border:3px solid; border-radius:25px; border-color: #aaa; width: 500px; height: 200px; margin: 100px  auto 0 auto"><div style="color: #aaa; padding: 80px; font-size: 2em; text-align: center;">'+Ux.locale.Manager.get("misc.nothingOnFile", "Nothing on File!")+'</div></div>'
                    :'<div style="background-color: #333; border:3px solid; border-radius:25px; border-color: #aaa; width: 200px; height: 100px; margin: 30px  auto 0 auto"><div style="color: #aaa; padding: 20px; font-size: 1em; text-align: center;">'+Ux.locale.Manager.get("misc.nothingOnFile", "Nothing on File!")+'</div></div>'
            });
        }
        me.setItems(items);
        me.setActiveItem(0);
        return !!j;
    },

    /**
     * @private
     *
     *  update photo records in PlacesPhotoBar in placesCombo tab
     *
     *    NOTE: buffered execution 500 ms delay
     *
     *   @param {GayGuideApp.view.tablet.PlacesDetail|GayGuideApp.view.phone.DetailPhone} c The placesDetail card.
     *   @param {Ext.data.Model} data The record data to be loaded.
     *
     */
    updateComboPhotos: Ext.Function.createBuffered(function(c, data) {
        this.log('updateComboPhotos', data.id);
        
        var j, i = 1,
            items = [];

        for (i = 1; i < 10; i++) {
            j = eval('data.list_pix' + i)
            if (j) {
                items.push([
                    '<img name="'+(i - 1)+'" style="margin: 10px 0 0 10px" src="http://gayguidevallarta.com/img.io/timthumb.php?h=200&src=', j.replace('http://www.gayguidevallarta.com',''), '" />'
                ].join(''));
            }
        }
        if (!items.length) {
            items.push( [
                '<div style="margin: 10px; height: 200px;" >',
                   '<div style="',
                       'background-color: #ccc;',
                       'background-image: url(./resources/images/NoPixBackground.jpg);',
                       'border-radius: 5px;',
                       'color: #aaa;',
                       'height: 100%;',
                       'padding: 40px;',
                       'font-size: 200%;',
                       'text-align: center;',
                   '">',
                       trans('SorryNoImagesFor'),
                       '<br />',
                       data.list_name,
                   '</div>',
               '</div>'
            ].join(''));
        }

        c.down('#placesComboPhotos').setHtml(items.join(''));
    }, 750),

    /**
     * @private
     *
     * respond to tap of photo in combophotobar
     * 
     */
    photoTapHandler: function(me) {
        var card = GayGuideApp.cards.placesDetail.down('tabpanel'),
            x = card.down('#PhotoContainer');

        card.setActiveItem(x);
        x.down('#Photo').setActiveItem(parseInt(me.target.name));
    },

    log: function() {
        var args = Array.prototype.slice.call(arguments);
        
        args.unshift(new Date().getTime()/1000);
        args.unshift('DetailController');
        if (this.getDebug())
            console.log( args);
    }    
});

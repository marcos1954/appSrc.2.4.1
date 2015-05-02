/**
 * GayGuideApp.controller.FavsController
 *
 */
Ext.define("GayGuideApp.controller.FavsController", {
    extend: "Ext.app.Controller",

    requires: [
        'Ext.Button',
        'Ext.List',
        'Ext.tab.Panel',
        'Ext.Map'
    ],

    config: {
        debug: false,
        routes: {
            'favslist':   'showFavsList',
            'noteslist':  'showNotesList',
            'recentlist': 'showRecentList'
        },
        
        before: {
            'showFavsList':   'hello',
            'showNotesList':  'hello',
            'showRecentList': 'hello'
        },
        
        refs: {
            favsList:     'favslist',
            notesList:    'noteslist',
            recentsList:  'recentslist',
            favsMore:     'favslist button[iconCls="list"]',
            notesMore:    'noteslist button[iconCls="list"]',
            recentsMore:  'recentslist button[iconCls="list"]',
            recentsClear: 'recentslist button[name="clearbutton"]'
        },
        control: {
            favsList: {
                select:   'doItemSelect',
                disclose: 'doFavsDisclose'
            },
            favsMore: {
                tap:      'doSlideNavAccess'
            },
    
            notesList: {
                select:   'doItemSelect',
                disclose: 'doNoteDisclose'
            },
            notesMore: {
                tap:      'doSlideNavAccess'
            },
    
            recentsList: {
                select:   'doRecentsSelect',
                disclose: 'doRecentsDisclose'
            },
            recentsMore: {
                tap:      'doSlideNavAccess'
            },
    
            recentsClear: {
                tap:      'askClearRecents'
            }
        }
    },

    /**
     *
     */
    hello: function(action) {
        ggv_log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl()))
            return;
        action.resume();
    },
    
    /**
     * opens or closes the slidenavigation container
     * to expose the main menu on the left
     *
     */
    doSlideNavAccess: function(me) {
        var x = me.up('slidenavigationview');
    
        this.log('doSlideNavAccess');
        if (x) {
            Ext.callback(x.toggleContainer, x, [], 0);
        }
    },

    /**
     * respond to router request for the favs List
     *
     */
    showFavsList: function() {
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) {
            if (!GayGuideApp.pendingRoute) {
                GayGuideApp.pendingRoute = 'favslist';
            }
            return;
        }
        this.log('showFavsList');
        reportView('/touch/#favs', 'Favorites List');
        var statusBar = Ext.Viewport.down('#mainStatusBar');
        statusBar && statusBar.clearAll();
        statusBar && statusBar.setLeft(Ux.locale.Manager.get('misc.favorites', 'Favorites'));
        //GayGuideApp.ggv.clearStatusBar();
        //GayGuideApp.ggv.setStatusBar(Ux.locale.Manager.get('misc.favorites', 'Favorites'), 'left');
        
        var xtype = GayGuideApp.isTablet() ? 'favslisttablet' : 'favslistphone',
            target = Ext.Viewport.down('slidenavigationview'),
            favs = target.container.down(xtype),
            store = GayGuideApp.store.favoritesList;
    
        if (!favs) {
            favs = target.container.add({
                    xtype: xtype,
                    id: 'favsList'
            });
        }

        store.getFilters().length && store.clearFilter();
        store.filter([{ filterFn: function(item) { return !!item.data.fav ; } }]);
        !favs.getStore() && favs.setStore(store);
    
        if (target.container.getActiveItem() == GayGuideApp.cards.placesDetail) {
            target.container.animateActiveItem(favs, {
                type:      'slide',
                direction: 'right'
            });
        }
        else {
            target.container.setActiveItem(favs);
        }
        Ext.callback(this.restoreFavsList, this, [], 150);
    },

    /**
     * when item in Favs List is selected,
     * send request to router.  Allows history to work.
     *
     */
    doFavsDisclose: function(me, record) {
        this.log('doFavsDisclose');
        
        me.setDisableSelection(false);
        me.select(record, false, true);
        
        if (record) {
            this.redirectTo('favs/' + record.data.id);
        }
    },
 
    /**
     *
     */
    restoreFavsList: function() {
        var state = GayGuideApp.ggvstate && GayGuideApp.ggvstate['favsList'];
        if (state) {
            var list = GayGuideApp.cards.favsList;
            
            if (Ext.isNumber(state.selectindex)) {
                var record = list.getStore().getRange(state.selectindex,state.selectindex)[0];
                 list.appearSelected(record);
            }
            Ext.defer(function() {
                GayGuideApp.cards.favsList.scrollToIndex(state.selectindex);
            }, 200, this);
        }
    },

    /**
     * respond to router request for the notes List
     *
     */
    showNotesList: function() {
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) {
            if (!GayGuideApp.pendingRoute) {
                GayGuideApp.pendingRoute = 'noteslist';
            }
            return;
        }
        
        this.log('showNotesList');
        reportView('/touch/#notes', 'Notes List');
        var statusBar = Ext.Viewport.down('#mainStatusBar');
        statusBar && statusBar.clearAll();
        statusBar && statusBar.setLeft(Ux.locale.Manager.get('misc.notes', 'My Notes'));
        
        var target = Ext.Viewport.down('slidenavigationview'),
            store = GayGuideApp.store.favoritesList;
            
        var xtype = GayGuideApp.isTablet() ? 'noteslisttablet' : 'noteslistphone',
            notes  = target.container.down(xtype);
            
        if (!notes) {
            notes = target.container.add({
                xtype: xtype,
                id: 'notesList'
            });
        }

        store.getFilters().length && store.clearFilter();
        store.filter([{ filterFn: function(item) { return !!item.data.notes; } }]);
        !notes.getStore() && notes.setStore(store);

        if (target.container.getActiveItem() == GayGuideApp.cards.placesDetail) {
            target.container.animateActiveItem(notes, {
                type:      'slide',
                direction: 'right'
            });
        }
        else {
            target.container.setActiveItem(notes);
        }
        Ext.callback(this.restoreNotesList, this, [], 150);
    },
    
    /**
     *
     *
     */
    restoreNotesList: function() {
        this.log('restoreNotesList');
        var state = GayGuideApp.ggvstate && GayGuideApp.ggvstate['notesList'];
        if (state) {
            var list = GayGuideApp.cards.notesList;
            
            if (Ext.isNumber(state.selectindex)) {
                var record = list.getStore().getRange(state.selectindex,state.selectindex)[0];
                 list.appearSelected(record);
            }
            Ext.defer(function() {
                this.log('restoreNotesList', 'defered');
                GayGuideApp.cards.notesList.scrollToIndex(state.selectindex);
            }, 200, this);
        }
    },

    /**
     * when item in Notes List is selected,
     * send request to router.  Allows history to work.
     */
    doNoteDisclose: function(me, record) {
        this.log('doNoteDisclose');
        
        me.setDisableSelection(false);
        me.select(record, false, true);
        
        if (record) {
            this.redirectTo('notes/' + record.data.id);
        }
    },
    
    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(new Date().getTime()/1000);
        args.unshift('FavsController')
        if (this.getDebug())
            console.log( args);
    }
});
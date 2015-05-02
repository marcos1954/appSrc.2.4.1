/*************************************************************
 * GayGuideApp.controller.PlacesController
 *
 *  controls mainstore store and associate list views that are data coupled to it
 *
 *        placesMenu - category list (uses Menu store)
 *        placesList - primary list view for mainstore
 */
Ext.define("GayGuideApp.controller.PlacesController", {
    extend: "Ext.app.Controller",

    requires: [
            'Ext.Button',
            'Ext.List',
            'Ext.tab.Panel',
            'Ext.Map'
    ],

    config: {
        debug: false,

        before:  {
            'showCatList':       'hello',
            'showPlacesList':    'hello',
            'showPlacesMenu':    'hello'
        },

        routes: {
            'placeslist/:cat':   'showPlacesList',
            'placescat/:cat':    'showPlacesList',
            'placesmenu':        'showPlacesMenu',
            'placescats':        'showCatList'
        },

        refs: {
            placesMenu:          '#placesMenuCard list',
            placesMenuNav:       '#placesMenuCard > titlebar  button[iconCls="list"]',

            placesList:          'placeslist',
            placesListCard:      'placeslistcard',
            placesListNav:       'placeslistcard > toolbar > button[iconCls="list"]',
            placesListBack:      'placeslistcard > toolbar > #placesListBackButton',
            placesFavsOnly:      'placeslistcard > toolbar > button[iconCls="star"]',

            catList:             'catlistphone catlist',
            catListNav:          'catlistphone > titlebar  button[iconCls="list"]'
        },

        control: {
            placesMenu: {
                select:          'doListSelect',
                disclose:        'doMenuDisclose'
            },
            placesMenuNav: {
                tap:             'doNavButtonTap'
            },

            placesList: {
                disclose:        'doPlacesListDisclose'
            },
            placesListNav: {
                tap:             'doNavButtonTap'
            },
            placesListBack: {
                tap:             'doPlacesListBack'
            },
            placesFavsOnly: {
                tap:             'doPlacesFavsOnly'
            },

            catList: {
                select:          'doCatListSelect',
                disclose:        'doCatListDisclose'
            },
            catListNav: {
                tap:             'doNavButtonTap'
            }
        }
    },

    hello: function(action) {
        this.log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    /**
     * @ private
     * showPlacesMenu
     *   displays top level MAIN MENU of "directory" (places)
     */
    showPlacesMenu: function() {
        this.log("showPlacesMenu");
        GayGuideApp.ggv.clearStatusBar();

        var nav    = Ext.Viewport.down('slidenavigationview'),
            target = nav.container,
            pm     = Ext.getCmp('placesMenuCard');

        this.doNavSelectDisplay('Gay PV Directory');
        nav.afterActionCloseRequested(nav);

        if (!target.down('#placesMenuCard')) {
            if (!pm) {
                pm = this.createPlacesMenu();
            }
            target.add([pm]);
        }
        
        // display the new view
        //
        if (target.getActiveItem().getId() == 'placesListCard' ) {
            target.animateActiveItem(pm, {
                type: 'slide',
                direction: 'right',
            });
        }
        else {
            target.setActiveItem(pm);
        }

        reportView('/touch/#placesmenu', 'Places Main Menu');
    },

    /**
     * @private
     * createPlacesList - responds to disclose event
     *   in placesList view
     */
    createPlacesMenu: function() {
        this.log('createPlacesMenu','GayGuideApp.cards.placesMenu is',!!GayGuideApp.cards.placesMenu);

        var pm = Ext.getCmp('placesMenuCard') || Ext.create(
            GayGuideApp.isTablet()
                ?'GayGuideApp.view.tablet.PlacesMenuTablet'
                :'GayGuideApp.view.phone.PlacesMenu',
            {
                id: 'placesMenuCard'
            }
        );

        if (!pm.down('list').getStore()) {
            var store = Ext.getStore('placesmenu');
            pm.down('list').setStore(store);
        }
        GayGuideApp.cards.placesMenu = pm;  // eliminate this?? someday!

        this.log('createPlacesMenu','GayGuideApp.cards.placesMenu SET', pm.getId());
        return pm;
    },

    /**
     * @private
     *
     * doMenuDisclose - responds to disclose event
     *  in placess MAIN MENU
     */
    doMenuDisclose: function(me, record) {
        this.log('doMenuDisclose', record.data.assocListSelect);
        var x = record.data.assocListSelect;
        if (GayGuideApp.ggvstate)
                GayGuideApp.ggvstate['placesList'] = null;
        if (x == '+') x = 'alpha';
        this.redirectTo('placeslist/' + x);
    },

    /**
     * showCatList -
     * shows catList view
     *
     *   responds to router from NavMenu list, or elsewhere by hash
     *   shows the catsList view
     *
     *  PHONE ONLY METHOD
     */
    showCatList: function() {
        this.log('showCatList');
        
        GayGuideApp.ggv.clearStatusBar();

        var nav = GayGuideApp.cards.viewport,
            target = nav.container,
            catList = GayGuideApp.cards.catList;

        // set main nav to reflect where we are
        //
        this.doNavSelectDisplay('Categories');
        nav.afterActionCloseRequested(nav);

        // create and add to mainCaintainers needed, switch activeItem
        // to display the view
        //
        if (!target.down('#catList')) {
            if (!catList) {
                catList = this.createCatList();
            }
            target.add([catList]);
        }
        
        // display the new view
        //
        if (target.getActiveItem().getId() == 'placesListCard' ) {
            target.animateActiveItem(catList, {
                type: 'slide',
                direction: 'right',
            });
        }
        else {
            target.setActiveItem(catList);
        }

        Ext.callback(this.restoreCatList, this, [], 150);

        reportView('/touch/#placescats', 'Places Cat List');
        return true;
    },
    
    
    restoreCatList: function() {
        var state = GayGuideApp.ggvstate && GayGuideApp.ggvstate['catList'];
        if (state) {
            var list = GayGuideApp.cards.catList.down('list');
            
            if (Ext.isNumber(state.selectindex)) {
                var record = list.getStore().getRange(state.selectindex,state.selectindex)[0];
                list.appearSelected(record);
            }

            Ext.defer(function() {
                GayGuideApp.cards.catList.down('list').scrollToIndex(state.selectindex);
            }, 200, this);
        }
    },


    /**
     * @private
     * createCatList - creates the cat list container and list, reuses existing if found
     *   in placesList view
     *
     *   PHONE ONLY VERSION
     */
    createCatList: function() {
        this.log('createCatList','GayGuideApp.cards.CatList is',!!GayGuideApp.cards.placesMenu);

        var cl = Ext.getCmp('catList') || Ext.create(
            'GayGuideApp.view.phone.CatListPhone',
            {
                id: 'catList'
            }
        );

        if (!cl.down('list').getStore()) {
            var store = Ext.getStore('catList');
            cl.down('list').setStore(store);
        }
        GayGuideApp.cards.catList = cl;  //  eliminate this someday

        this.log('createCatList','GayGuideApp.cards.catList is SET',cl.getId());
        return cl;
    },

    /**
     * @private
     * doCatListDisclose - responds to disclose button in catList
     *
     *   PHONE ONLY VERSION
     */
    doCatListDisclose: function(me, record) {
        this.log('doCatListDisclose', record.data.catcode);
        var code = record.data.catcode;
        
        me.setDisableSelection(false);
        me.select(record, false, true);
        
        if (GayGuideApp.ggvstate)
            GayGuideApp.ggvstate['placesList'] = null;

        this.redirectTo('placeslist/' + code);
    },

    showPlacesList: function(cat) {
        this.log('CORRECT ENTRANCE showPlacesList', cat);
        var nav = Ext.Viewport.down('slidenavigationview'),
            mc = nav.container,
            code = (cat == 'alpha') ? '+' : cat;
        GayGuideApp.ggv.clearStatusBar();

        // set main nav to reflect where we are
        //
        var record = GayGuideApp.store.catList.findRecord('catcode', code, 0, false, false, true);
        var navName =  ((code == '-')
                        ? Ux.locale.Manager.get('places.categories.all.menuName', 'Categorised List')
                        : (code == '+')
                          ? Ux.locale.Manager.get('places.categories.alpha.menuName', 'Alphabetized  List')
                          : record.data.catname);
        
        this.doNavSelectDisplay(navName);
        nav.afterActionCloseRequested(nav);
        
        // set filters, buttons, title, etc to show correct placesList view
        //
        var pl = this.doShowPlacesListSetup(code, navName);
        
        // display the new view
        //
        if (mc.getActiveItem().getItemId() == 'placesDetailContainer') {
            mc.animateActiveItem(pl, { type: 'slide', direction: 'right' });
        }
        else if ((mc.getActiveItem().getItemId() == 'placesMenuCard')) {
            mc.animateActiveItem(pl, { type: 'slide', direction: 'left' });
        }
        else if ((mc.getActiveItem().getId() == 'catList')) {
            mc.animateActiveItem(pl, { type: 'slide', direction: 'left' });
        } 
        else {
            mc.setActiveItem(pl);
        }
        pl.down('list').refresh();
        
        Ext.callback(this.restorePlacesList, this, [], 150);

        return true;
    },
    
    restorePlacesList: function() {
        var state = GayGuideApp.ggvstate && GayGuideApp.ggvstate['placesList'];
        if (state) {
            var list = GayGuideApp.cards.placesList.down('list');
            
            if (Ext.isNumber(state.selectindex)) {
                var record = list.getStore().getRange(state.selectindex,state.selectindex)[0];
                list.appearSelected(record);
            }

            Ext.defer(function() {
                GayGuideApp.cards.placesList.down('list').scrollToIndex(state.selectindex);
            }, 200, this);
        }
    },

    /**
     * @private
     * createPlacesList - responds to disclose event
     *   in placesList view
     */
    createPlacesList: function() {
        this.log('createPlacesList','GayGuideApp.cards.placesList is', !!GayGuideApp.cards.placesList);

        var pl = Ext.getCmp('placesListCard') || Ext.create(
            GayGuideApp.isTablet()
                ?'GayGuideApp.view.tablet.PlacesListTablet'
                :'GayGuideApp.view.phone.PlacesListPhone',
            {
                id: 'placesListCard'
            }
        );
        GayGuideApp.cards.placesList = pl;  // <<<<<< eliminate this someday

        this.log('createPlacesList','GayGuideApp.cards.placesList set',pl.getId());
        return pl;
    },

    /*
     * doShowPlacesListSetup -
     *
     *  filters, sorts, sets up the toolbar button for placesList View
     *
     * @private
     *
     */
    doShowPlacesListSetup: function(code, codename, last) {
        this.log('doShowPlacesListSetup', code, last);
        if (!code) return null;

        var slideNav  = Ext.Viewport.down('slidenavigationview'),
            listcard  = Ext.getCmp('placesListCard'),
            store     = Ext.getStore('mainstore').getView('placeslist'),
            statusBar = Ext.Viewport.down('#mainStatusBar'),
            name      = Ext.util.Format.ellipsis(codename,GayGuideApp.isPhone()?25:50),
            favsOnly = GayGuideApp.ggv.favsOnly,
            isFullList = (code == '-' || code == '+'),
            filter = [], list;

        // get placesList card, create if needed
        //
        if (!slideNav.down('#placesList')) {
            if (!listcard) {
                listcard = this.createPlacesList();
            }
            slideNav.container.add(listcard);
        }
        list = listcard.down('list');
        if (!list.getStore())
            list.setStore(store);

        listcard._last = last,
        listcard._listCode = code;
        listcard._grouperData = null;
        listcard._filterData = null;
        listcard._listSearch = null;

        store.clearFilter(true);
        list.scrollToTop(list);

        if (favsOnly) {
            filter.push({
                property: 'fav',
                value: 1
            });
        }

        if (!isFullList) {
            var listcode = code;
            filter.push({
                filterFn: function(item) {
                    if (listcode == item.data.list_cat || listcode == item.data.list_cat_page)
                        return true;
                    return false;
                }
            });
        }

        if (filter.length) {
            store.filter(filter);
        }
        list.getScrollable().getScroller().scrollToTop(true);

        if ((code == '+')) {
            store.setGrouper({
                groupFn: function(record) {
                    return record.get('list_name').substr(0, 1).toUpperCase().latinise();
                }
            });
            store.sort([{
                property: 'list_name',
                root: 'data',
                direction: 'ASC'
            }], 'ASC');
        }
        else  {
            store.setGrouper({
                groupFn: function(record) {
                    return record.get('list_cat_name');
                }
            });
            store.sort([{
                property: 'list_cat_name',
                root: 'data',
                direction: 'ASC'
            }, {
                property: 'list_name',
                root: 'data',
                direction: 'ASC'
            }], 'ASC');
        }

        /*
         *  UI changes needed for this List
         */
        try { list.setIndexBar(isFullList && !GayGuideApp.ggv.favsOnly); } catch (err) {};

        var button = listcard.down('toolbar > button[itemId="placesFavsOnlyButton"]'),
            favsOnly = GayGuideApp.ggv.favsOnly;

        if (favsOnly) {
            button.addCls('faved');
            GayGuideApp.popups.onlyFavsShowing.setHtml(
                Ux.locale.Manager.get('nav.msg.onlyfavslist', 'Only Favorites Showing'));
            Ext.defer(GayGuideApp.popups.onlyFavsShowing.showBy, 600, GayGuideApp.popups.onlyFavsShowing, [button, 'tr-bc?']);
        }
        else {
            button.removeCls('faved');
        }

        listcard.down('#placesListBackButton').setHidden(isFullList);
        listcard.down('button[iconCls="list"]').setHidden(!isFullList);
        listcard.down('#placesListToolbar').setTitle(name);
        statusBar && statusBar.clearAll();
        statusBar && statusBar.setLeft(name)


        return listcard;
    },

    /**
     * @private
     *
     * doPlacesListDisclose - responds to disclose event
     *   in placesList view
     */
    doPlacesListDisclose: function(me, record) {
        this.log('doPlacesListDisclose', record.data.id);
        
        me.setDisableSelection(false);
        me.select(record, false, true);

        this.redirectTo('places/' + record.data.id);
    },

    /**
     * @private
     * respond to 'tap' event on back button placesList view
     * heads back to the placesMenu view
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     */
    doPlacesListBack: function(me, e, eOpts) {
        this.log('doPlacesListBack');
        var pl = me.getParent().getParent(),
            mc = pl.getParent();

        this.getApplication().getHistory().back();
    },

    /**
     * @private
     * Open the slideNavigation
     *   responds the button tap
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     */
    doNavButtonTap: function(me, e, eOpts) {
        this.log('doMoreToggleToolbar');
        var x = me.up('slidenavigationview');

        Ext.callback(x.toggleContainer, x, [], 0);
    },

    /**
     * @private
     */
    doPlacesFavsOnly: function(me) {
        this.log('doPlacesFavsOnly');

        var listcard = GayGuideApp.cards.placesList,
            list = listcard.down('list'),
            store = list.getStore(),
            mappanel = GayGuideApp.cards.viewport.down('mappanel'),
            filter = [];


            GayGuideApp.ggv.favsOnly = !GayGuideApp.ggv.favsOnly;

        this.doShowPlacesListSetup(listcard._listCode, listcard.down('toolbar').getTitle().getHtml())
        list.refresh();

        GayGuideApp.ggv.markerDirty = true;
    },

    /**
     * @private
     */
    onTagsLoad: function(store, records, success) {
        var control = GayGuideApp.app.getApplication().getController('EventsController');
        control.log('onTagsLoad', 'tag store loaded');  // cant do this

        var browseCard = GayGuideApp.cards.browseCard;

        if (!success) {
            Ext.Msg.confirm('Gay Guide Vallarta', 'Load of Tags Failed<br />Retry?', function(value) {
                if (value == 'yes') { store.load(); return; }
            }, this);
            return;
        }

        if (browseCard && !browseCard.down('taglist').getStore()) {
            browseCard.down('taglist').setStore(store);
        }

        GayGuideApp.app.getApplication().getController('PlacesController').calcTagCounts();
    },

    /**
     * @private
     */
    calcTagCounts: function() {
        this.log('calcTagCounts');
        var store = Ext.getStore('mainstore');

        var s = store.getFilters();  // eliminate someday
        if (s.length) {
            this.log('calcTagCounts','mainstore is filtered!');
            store.clearFilter();
        }

        if (store.getCount() && GayGuideApp.store.tags && GayGuideApp.store.tags.getCount()) {
            var tagcounts = {};

            store.each(function(item, index){
                var placesItem = item;

                if (item.data.list_tagcodes) {
                    Ext.Array.each(item.data.list_tagcodes.split('|'), function(item, index) {
                        tagcounts[item] = tagcounts[item] || { tagcode: item, count: 0 };
                        tagcounts[item].count++;
                    }, this);
                }
            });

            GayGuideApp.store.tags.each(function(record, index) {
                record.set('tagcount', (tagcounts[record.data.codekey]) ? tagcounts[record.data.codekey].count : 0);
            });
        }
        if (s.length) store.setFilters(s);  // eliminate someday
    },

    /**
     *  doNavSelectDisplay
     *
     *    set navList to show here (may not be if #hash changed to get here)
     *    we search here the 'name' property in that list to get it right
     *    no matter where in the list.
     */
    doNavSelectDisplay: function (name) {
        this.log('doNavSelectDisplay', name);

        var list = GayGuideApp.cards.viewport.list,
            navIndex =  Ext.pluck(Ext.pluck(
                list.getStore().getRange(),
                'data'),
                'name').indexOf(name);

        if (navIndex > -1) {
            list.deselectAll(true, true);
            list.select(navIndex, false, true);
        }
    },

    /**
     * @private
     */
    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('PlacesController');
        if (this.getDebug())
            console.log( args);
    }
});

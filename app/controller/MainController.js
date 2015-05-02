/**
 * GayGuideApp.controller.MainController
 *
 *
 */
Ext.define("GayGuideApp.controller.MainController", {
    extend: "Ext.app.Controller",

    requires: [
        //'Ext.device.Device',
        //'Ext.device.Connection',
        'Ext.Button',
        'Ext.List',
        'Ext.picker.Date',
        'Ext.tab.Panel',
        'Ext.Map',
        'GayGuideApp.controller.MapaController',
        'Ux.pinchzoom.ImageCarousel',
        'GayGuideApp.view.MapSettings',
        'GayGuideApp.view.CuisineMenu',
        'GayGuideApp.model.Tags',
        'Ext.data.proxy.JsonP',
        'GayGuideApp.view.phone.CatListPhone'
    ],

    config: {
        debug: false,
        routes: {
            'settings' :       'showSettings'
        },

        before: {
            'showSettings':    'hello'
        },

        refs: {
            MainNav:     'slidenavigationview',
            MainView:    'slidenavigationview > #MainContainer',
            MainList:    'slidenavigationview > list',

            Search:      'slidenavigationview  searchfield',
            SearchList:  '#searchPopup > #searchPopupList'
        },
        control: {
            MainNav: {
                closerequest:  'doCloseRequest'
            },
            MainView: {
                activeitemchange:
                               'doActiveItemChange'
            },
            MainList: {
                select:        'doMainSelect'
            },

            Search: {
                keyup:         'doSearchKeyUp',
                action:        'doSearchAction',
                clearicontap:  'doSearchClear',
                focus:         'doSearchFocus'
            },
            SearchList: {
                itemsingletap: 'tapSearchListItem'
            }
        }
    },

    /**
     *
     *
     */
    launch: function() {
        this.log('launch', '>> getApplication()', this.getApplication());
        //alert('launch maincontroller');
        
        //console.log('spinning start');
        //for (j=10; j--;) {
        //    for(i=1000; i--;) 
        //    console.log('spinning', j);
        //}
        //console.log('spinning done');
        
        
        var mgr = Ux.locale.Manager;

        GayGuideApp.today = new Date();

        GayGuideApp.isPhone = function() {
            return GayGuideApp.ggv.profile == 'Phone';
        };
        GayGuideApp.isTablet = function() {
            return GayGuideApp.ggv.profile == 'Tablet';
        };
        
        GayGuideApp.isCordova = function() {
           return (typeof cordova !== 'undefined');
        };
        
        GayGuideApp.isAndroid = function() {
           return (Ext.os.name == 'Android');
        };
        
        GayGuideApp.isNative = function() {
            if (window.location.hostname == "") {
                return true;
            }

            if (window.location.hostname != "www.gayguidevallarta.com") {
                return false;
            }
            return Ext.browser.is.WebView;
        };

        mgr.setConfig({
            ajaxConfig : {
                method : 'GET'
            },
            language   : GayGuideApp.lang.split('-')[0] || navigator.language.split('-')[0],
            tpl        : './locale/{locale}.json',
            type       : 'ajax'
        });

        mgr.init(function(me, option, success, response){
            if (!success) {
                ggv_log('locale load failed: response is ', response);
                alert('locale info load failed');
            }
        });

        this.applaunch();
    },

    /**
     *
     *
     */
    hello: function(action) {
        ggv_log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    /**
     * @private
     *  handle route 'settings'
     *
     */
    showSettings: function() {
        reportView('/touch/#settings', 'Settings');

        var target  = Ext.Viewport.down('slidenavigationview'),
            settings = target.container.down('#SettingsContainer');

        if (!settings) {
            settings = target.container.add({
                xtype:  'container',
                id:     'SettingsContainer',
                layout: 'card',
                items:  [{ xtype: GayGuideApp.isTablet() ? 'settingstablet' : 'settings' }],
                slideButton: { selector:  'titlebar' }
            });
        }
        target.container.setActiveItem(settings);
    },

    /**
     *
     */
    doCloseRequest: function(me) {
        me.afterActionCloseRequested(me)
    },

    /**
     *
     */
    doMainSelect: function() {
        if (!GayGuideApp.cards || !GayGuideApp.cards.viewport) return true;

        var     search = GayGuideApp.cards.viewport.list.down('searchfield');

        search && search.setValue('');
        return true;
    },

    /**
     *
     *
     */
    doSearchClear: function(me) {
        me.setValue('');
        GayGuideApp.ggv.keyupSearch && GayGuideApp.ggv.keyupSearch(me);
        return true;
    },

    /**
     *
     *
     */
    doSearchAction: function(me, e, eOpt) {
        return true;
    },

    /**
     *
     *
     */
    doSearchFocus: function(me, e, eOpt) {
        var slistStore = GayGuideApp.store.sList,
            y = Ext.Viewport.down('searchpopup');

            if (!y) return;
            this.doSeachListDisplay(me, y);
    },

    /**
     *
     */
    doSearchKeyUp: function(me, e, eOpt) {
        GayGuideApp.ggv.keyupSearch = GayGuideApp.ggv.keyupSearch || Ext.Function.createBuffered(function(me) {
            var slistStore = GayGuideApp.store.sList,
                y = Ext.Viewport.down('searchpopup');

            y = y || Ext.Viewport.add(GayGuideApp.popups.searchPopup);

            slistStore.clearFilter(false);
            slistStore.filterBy(function(record, id) {
                if (!record.get('list_latitude'))
                    return false;
                if (record.get('list_name').toLowerCase().indexOf(me.getValue().toLowerCase()) !== -1)
                    return true;
                if (record.get('list_tags')
                 && record.get('list_tags').toLowerCase().indexOf(me.getValue().toLowerCase()) !== -1)
                    return true;
                return false;
            }, this );

            this.doSeachListDisplay(me, y);
        }, 200, this);
        GayGuideApp.ggv.keyupSearch(me);
        return true;
    },

    /**
     *
     *
     */
    doSeachListDisplay: function(me, y) {
        if (me.getValue() == '') {
            y.hide();
        }
        else if (y.getHidden()) {
            y.down('list').deselectAll(true);
            y.showBy(me, "tl-bl");
            y.down('list').getScrollable().getScroller().scrollTo(0,1);
            y.down('list').getScrollable().getScroller().scrollTo(0,0);
        }
    },

    /**
     *
     *
     */
    tapSearchListItem: function(me, index, target, record, e, eOpts) {
        var x = record.data.id;

        GayGuideApp.popups.searchPopup.hide();
        GayGuideApp.cards.viewport.closeContainer();
        GayGuideApp.cards.viewport.list.down('searchformfield').setValue('');

        Ext.defer(function() { GayGuideApp.popups.searchPopup.down('list').deselect(record, true); }, 500);
        this.redirectTo('search/' + x, true);
    },

    /**
     *
     */
    doActiveItemChange: function(me, item, olditem) {
        if (item.getItemId() != 'placesDetailContainer'
         && item.getItemId() != 'eventsListCard'
         && item.getItemId() != 'eventsDetailContainer'
         && item.getItemId() != 'GalleryContainer' ) {
            
            //GayGuideApp.ggv.setStatusBar('');
        }
        
        if (item.restoreState) {
            if (!GayGuideApp.ggvstate) return;
            var state = GayGuideApp.ggvstate[item.getItemId()]
            //item.restoreState(state);
        }

        //console.log( 'start activeItemChange ',  item.getItemId(), me)

        //if (item.getItemId() == 'eventsList') {
        //    item.refresh();
        //    GayGuideApp.ggv.setStatusBar(transDate(GayGuideApp.today));
        //}

        /**
         * DayCalendar
         *
         */
        if (item.getItemId() == 'DayCalendarContainer' ) {
            var eventsList = child('eventsListCard');
            item.setActiveItem(eventsList);
            
            eventsList.fireEvent('favsshow', item.getComponent(0));
            eventsList.fireEvent('calLoadReq', item.getComponent(0));
        }

        /**
         * Favorites List
         *
         *   unless coming from placesDetail
         */
        if (item.getItemId() == 'FavsContainer'
         && olditem.getItemId
         && olditem.getItemId() != 'placesDetail') {
            GayGuideApp.store.favoritesList.clearFilter(true);
            GayGuideApp.store.favoritesList.filter('fav', '1');
        }

        // close slide aside menu
        //
        var ctl = me.up('slidenavigationview');
        if (item.getItemId() == 'placesListCard') {
            if (!item._ggv_NoClose) {
                ctl.fireEvent('closerequest', ctl);
            }
            item._ggv_NoClose = false;
        }
        else {
            ctl.fireEvent('closerequest', ctl);
        }
        
        Ext.defer(this.doCleanup, 800, this, [ olditem, me, item ]);
    },
    
    doCleanup: function(olditem, me, item) {
        // delete unused views that we can
        //
        //console.log('MainContainer Deactivate CleanUp', olditem);
        closeList = [

            'GalleryContainer',
            'browseCard',
            'MapContainer',
            'notesList',
            'placesListCard',
            'placesDetailContainer',
            'placesMenuCard',
            'catList',
            'eventsDetailContainer',
            'eventsListCard',
            'favsList',
            'SettingsContainer'

        ].forEach(function(cardname, index) {
            if ( olditem
             && (olditem.getId() == cardname)
            ) {

                //console.log('>>>DESTROY ', cardname, 'LITE',!!olditem.onActivate);
                olditem.onActivate && olditem.onActivate(olditem);
    
                if (olditem.getItemId() == 'browseCard')
                    GayGuideApp.cards.browseCard = null;
                else if (olditem.getItemId() == 'favsList')
                    GayGuideApp.cards.favsList = null;
                else if (olditem.getItemId() == 'notesList')
                    GayGuideApp.cards.notesList = null;
                else if (olditem.getItemId() == 'placesList')
                    GayGuideApp.cards.placesList = null;
                else if (olditem.getItemId() == 'placesDetailContainer')
                    GayGuideApp.cards.placesDetail = null;
                else if (olditem.getId() == 'placesMenuCard')
                    GayGuideApp.cards.placesMenu = null;
                else if (olditem.getId() == 'catList')
                    GayGuideApp.cards.catList = null;
                else if (olditem.getId() == 'eventsListCard')
                    GayGuideApp.cards.eventsList = null;
                else if (olditem.getId() == 'eventsDetailContainer')
                    GayGuideApp.cards.eventsDetail = null;
    
                if (olditem.saveState) {
                    GayGuideApp.ggvstate = GayGuideApp.ggvstate || {};
                    this.log('>>>DESTROY', 'calling saveState', olditem.getItemId());
                    GayGuideApp.ggvstate[olditem.getItemId()] = olditem.saveState(); 
                }
                
                Ext.defer(function(me) {
                    //me.getInnerItems().forEach(function(i) {
                    //    i.destroy();
                    //});
                    me.destroy();
                }, 1, this, [ olditem ]);
            }
        }, this);
    },

    /**
     *
     *
     */
    applaunch: function() {
        var app = GayGuideApp,
            cards,
            viewport,
            ctl,
            v;

        if (!Ux.locale.Manager.isLoaded()) {
            Ext.defer(this.applaunch, 30, this);
            this.log('applaunch delay');
            return;
        }

        this.log('applaunch LAUNCH!');
        app.txtSzBase = parseFloat(getbodytxtsize().replace( /[^0123456789.]+/g, ''));
        
        changemysize(app.txtSzBase +'px');
        
        if (readCookie('txtSz')) {
            app.txtSz = readCookie('txtSz');
        }

        if (app.txtSz && app.txtSz < 26) {
            changemysize(app.txtSz+'px');
        }
        
        
        //if (Ext.device) {
            //alert('hello')
            //alert([
            //  'Device name: ' + Ext.device.Device.name,
            //  'Device platform: ' + Ext.device.Device.platform
            //].join('\n'));
            //
            //Ext.defer(function() {ggv_log(Ext.device.Device,Ext.device.Connection)},5000, this);
            //alert([
            //  'isOnline: ' + Ext.device.Connection.isOnline(),
            //  'ConnType: ' + Ext.device.Connection.getType()
            //].join('\n'));
            //
            //Ext.device.Connection.on(
            //  'onlinechange',
            //  function(online, type) {
            //      alert([
            //          'isOnline: ' + online,
            //          'ConnType: ' + type
            //      ].join('\n'));
            //  },
            //  this,
            //  10000);
        //}

        //
        // create app views
        //
        cards = app.cards = {};

        if (app.isTablet()) {
            v = 'GayGuideApp.view.tablet.Main';

            app.cards.viewport = Ext.create(v);
            app.cards.viewport.addCls('ggv-tablet');
            Ext.Viewport.add(app.cards.viewport);
        }
        else {
            v = 'GayGuideApp.view.phone.PhoneViewport';

            v = Ext.create(v);
            app.cards.viewport      = v.query('slidenavigationview')[0];
            app.cards.viewport.addCls('ggv-phone');
            Ext.Viewport.add(v);
        }

        app.cards.MainContainer = app.cards.viewport.down('#MainContainer');

        app.store = app.store || {};

        app.popups = {};
        app.today = new Date();
        app.popups.noMoreInList = Ext.create('Ext.Panel', {
            html: 'Floating Panel',
            left: 0,
            padding: 10,
            hidden: true,
            listeners: {
                painted: function(me) {
                    Ext.defer(app.popups.noMoreInList.hide, 1200, app.popups.noMoreInList);
                }
            }
        });
        //GayGuideApp.cards.MainContainer.add(app.popups.noMoreInList);

        app.popups.onlyFavsShowing = Ext.create('Ext.Panel', {
            html: 'Floating Panel',
            left: 0,
            padding: 10,
            hidden: true,
            listeners: {
                painted: function(me) {
                    Ext.defer(app.popups.onlyFavsShowing.hide, 1200, app.popups.onlyFavsShowing);
                }
            }
        });
        //GayGuideApp.cards.MainContainer.add(app.popups.onlyFavsShowing);

        app.popups.searchPopup = Ext.create('GayGuideApp.view.SearchPopup', {});
        Ext.Viewport.add(app.popups.searchPopup);

        app.popups.bottomAd = Ext.create('GayGuideApp.view.BottomAd', {});
        Ext.Viewport.add(app.popups.bottomAd);

        app.ggv.getEvents  = this.getEvents;
        app.ggv.reloadData = this.reloadDataStores;
        app.ggv.loadData   = this.getInitialDataStores;

        Ux.locale.Manager.applyLocales();
        if (!GayGuideApp.isNative()) {
            Ux.homescreen.HomeScreen.init();
        }
        GayGuideApp.app.getApplication().redirectTo('placesmenu', true);

        // create the stores, loads data from server
        //
        Ext.defer(this.getInitialDataStores, 1, this);
        //if (navigator.splashscreen) {
        //    setTimeout(function() {
        //        //navigator.splashscreen.hide();
        //    }, 1000);
        //}
    },

    /**
     *
     *
     */
    reloadDataStores: function(lang) {
        var app = GayGuideApp,
            ggv = app.ggv,
            favsXtype = app.isTablet()?'favslisttablet':'favslistphone',
            notesXtype = app.isTablet()?'noteslisttablet':'noteslistphone';

        Ext.Viewport.down('#searchfield').setPlaceHolder(trans('search'));
        ///////////////////////////////////////////////////////////////
        GayGuideApp.ggv.loadMask && GayGuideApp.ggv.loadMask.destroy();
        GayGuideApp.ggv.loadMask =  Ext.create('Ext.LoadMask', {
            xtype: 'loadmask',
            indicator: true,
            zIndex: 10,
            cls: 'ggv-loadmask'
        });

        GayGuideApp.ggv.loadMask.setMessage(Ux.locale.Manager.get("misc.loadLocaleMsg", "Loading ..."));
        Ext.Viewport.setMasked(GayGuideApp.ggv.loadMask);
        ///////////////////////////////////////////////////////////////
        GayGuideApp.ggv.clearMapMarkers(GayGuideApp.cards.MarkerMap);
        ///////////////////////////////////////////////////////////////
        //
        // ATM reset
        //     is this enough?  should this be in GayGuideApp.store.atm... why ggv?
        //
        //GayGuideApp.ggv.atmData.removeAll(true);

        GayGuideApp.ggv.atmData && GayGuideApp.ggv.atmData.destroy;

        GayGuideApp.ggv.atmData = null;
        ///////////////////////////////////////////////////////////////
        if (GayGuideApp.store.tags) {
            GayGuideApp.store.tags.destroy();
            GayGuideApp.store.tags = false;
            if (GayGuideApp.cards.browseCard) {
                GayGuideApp.cards.browseCard.down('taglist').setStore(null);
            }
        }
        ///////////////////////////////////////////////////////////////

        ['#FavsContainer','#NotesContainer'].forEach(function(item) {
            var x = GayGuideApp.cards.viewport.container.down(item);
            x && x.onActivate(x);
        });

        GayGuideApp.store.favoritesList.clearFilter(true);
        GayGuideApp.store.favoritesList.removeAll(false);
        GayGuideApp.store.catList      && GayGuideApp.store.catList.removeAll(false);
        GayGuideApp.store.pList        && GayGuideApp.store.pList.removeAll(false);
        GayGuideApp.store.sList        && GayGuideApp.store.sList.removeAll(true);
        GayGuideApp.store.pList2       && GayGuideApp.store.pList2.removeAll(true);
        GayGuideApp.store.nList        && GayGuideApp.store.nList.removeAll(true);
        //GayGuideApp.store.recentsStore && GayGuideApp.store.recentsStore.destroy();
        //GayGuideApp.store.recentsStore = null;


        ///////////////////////////////////////////////////////////////
        GayGuideApp.store.eventsStore.clearFilter(true);
        GayGuideApp.store.eventsStore.removeAll(false);
        ///////////////////////////////////////////////////////////////
        //GayGuideApp.cards.placesList && GayGuideApp.cards.placesList.down('placeslist').onActivate(GayGuideApp.cards.placesList.down('placeslist'));
        //GayGuideApp.cards.placesList && GayGuideApp.cards.placesList.down('placeslist').setStore(null);

        Ext.getStore('mainstore').clearFilter(true);

        GayGuideApp.store.placesList.each(function(i){
            if (i.eventsStore) {
                i.eventsStore.destroy();
            }
        });
        Ext.getStore('mainstore').removeAll();
        //GayGuideApp.store.placesList = null;


        //GayGuideApp.store.placesList = Ext.create('GayGuideApp.store.Main', {});
        GayGuideApp.store.favoritesList = Ext.create('GayGuideApp.store.Favorites', {});

        GayGuideApp.cards.placesList && GayGuideApp.cards.placesList.down('placeslist').setStore(Ext.getStore('mainstore').getView('placeslist'));
        GayGuideApp.cards.placesList && GayGuideApp.cards.placesList.down('placeslist').refresh();
        ///////////////////////////////////////////////////////////////
        var eventsList  = GayGuideApp.cards.viewport.container.down('#eventsList'),
            favsList    = GayGuideApp.cards.viewport.container.down('#FavsContainer'),
            favsList    = favsList && favsList.down('list'),
            notesList   = GayGuideApp.cards.viewport.container.down('#NotesContainer'),
            notesList   = notesList && notesList.down('list');

        if (eventsList) {
            eventsList.onActivate &&eventsList.onActivate(eventsList);
            eventsList.setStore(null);
            eventsList.refresh();
            eventsList._ggv_needload = true;
        }

        if (favsList) {
            favsList.fireEvent('langchanged', favsList, lang, null);
            favsList.refresh();
        }

        if (notesList) {
            notesList.fireEvent('langchanged', notesList, lang, null);
            notesList.refresh();
        }

        ///////////////////////////////////////////////////////////////
        Ext.defer(this.getInitialDataStores, 1, this);
    },

    //////////////////////////////////////////////////////////////
    //  getInitialDataStores
    //
    //  creates all the data stores and loads them.
    //  called just after launch one time.
    //
    getInitialDataStores: function() {
        this.log("masking");
        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.ggv.loadMask = GayGuideApp.ggv.loadMask || Ext.create('Ext.LoadMask', {
            xtype: 'loadmask',
            indicator: true,
            zIndex: 10,
            cls: 'ggv-loadmask'
        });
        GayGuideApp.ggv.loadMask.setMessage(Ux.locale.Manager.get("misc.loadLocaleMsg", "Loading ..."));
        if (!Ext.Viewport.getMasked()) {
            Ext.Viewport.setMasked(GayGuideApp.ggv.loadMask);
        }
        this.log("load favorites");

        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.store.favorites = Ext.StoreManager.get('favorites');
        if (!GayGuideApp.store.favorites.isLoaded()) {
            try {
                GayGuideApp.store.favorites.load();
            } catch(err) {
                ggv_log('favorites load failed!')
            }
        }
        
        this.log("load main menu");

        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.store.placesMenu = Ext.StoreManager.get('menu');
        GayGuideApp.store.placesMenu.each(function(model, index, length ) {
            model.set('menuName',     Ux.locale.Manager.get('places.categories.'+model.data.localeKey+'.menuName', 'model.data.menuName'));
            model.set('menuAuxText',  Ux.locale.Manager.get('places.categories.'+model.data.localeKey+'.auxText', 'model.data.menuAuxText'));
        });
        //GayGuideApp.cards.placesMenu.down('list').refresh();
        /////////////////////////////////////////////////////////////////////////////
        if (true || GayGuideApp.popups.cuisineMenu) {

            this.log("load tags");

            var ctl = GayGuideApp.app.getApplication().getController('PlacesController');
            GayGuideApp.store.tags = GayGuideApp.store.tags || Ext.create('Ext.data.Store', {
                id: 'tagStore',
                storeId: 'tagListStore',
                model: 'GayGuideApp.model.Tags',
                autoLoad: false,
                proxy: {
                    type: 'jsonp',
                    url: GayGuideApp.jsonBase+'/ajax/json.tags.php',
                    enablePagingParams: false,
                    timeout: 30000,
                    reader: {
                        type: 'json',
                        rootProperty: 'tags'
                    }
                },
                listeners: {
                    load: GayGuideApp.app.getApplication().getController('PlacesController').onTagsLoad
                }
            });

            GayGuideApp.store.tags.getProxy().setExtraParams({
                 lang: GayGuideApp.lang || readCookie('t_lang') || 'en',
                 vsn: 2
            });
            if (!GayGuideApp.store.tags.isLoaded()) GayGuideApp.store.tags.load();
        }
        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.orientationListener = GayGuideApp.orientationListener || Ext.Viewport.addListener('orientationchange', this.onOrientationChange);
        /////////////////////////////////////////////////////////////////////////////
        Ext.define('GayGuideApp.model.GalleryDirs',{
            extend: 'Ext.data.Model',
            config:  {
                fields: [{
                    name: "name",
                    type: 'string'
                },{
                    name: "dirname",
                    type: 'string'
                },{
                    name: "path",
                    type: 'string'
                },{
                    name: "last_modified",
                    type: 'string'
                },{
                    name: "pix",
                    type: 'string'
                }]
            }
        });

        GayGuideApp.store.galleryDirs = GayGuideApp.store.galleryDirs  || Ext.create('Ext.data.Store', {
            id:                           'galleryDirs',
            autoLoad:                     false,
            model:                        'GayGuideApp.model.GalleryDirs',
            proxy: {
                type:                 'jsonp',
                url:                  GayGuideApp.jsonBase+'/ajax/json.gallery.php',
                enablePagingParams:   false,
                timeout:              30000,
                extraParams: {
                    lang:         GayGuideApp.lang
                },
                reader: {
                    type:         'json',
                    rootProperty: 'albums'
                }
            }
        });

        if (!GayGuideApp.store.galleryDirs.isLoaded()) {
            this.log("load galeries");

            GayGuideApp.store.galleryDirs.load();
        }
        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.store.eventsStore =  GayGuideApp.store.eventsStore || Ext.create('GayGuideApp.store.EventsStore', {
            listeners: {
                load: GayGuideApp.app.getApplication().getController('EventsController').onEventsLoad
            }
        });

        GayGuideApp.store.eventsList = GayGuideApp.store.eventsStore.getView('eventsList');
        if (!GayGuideApp.store.eventsList) {
            GayGuideApp.store.eventsList = GayGuideApp.store.eventsStore.addView({
                name: 'eventsList',
                filterFn: function(item) { return true; }
            }).store;

            GayGuideApp.store.eventsList.setGroupField('eventList');
            GayGuideApp.store.eventsList.setGroupDir('ASC');
            GayGuideApp.store.eventsList.setGrouper({
                groupFn: function(record) {
                    return record.get('eventList');
                },
                sortProperty: 'listOrder'
            }),

            GayGuideApp.store.eventsList.setSorters([{
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
        
        
        /////////////////////////////////////////////////////////////////////////////
        GayGuideApp.ggv.atmData = GayGuideApp.ggv.atmData || Ext.create('Ext.data.Store', {
            id: 'atmList',
            model : 'GayGuideApp.model.Atm',
            autoLoad: false,
            proxy: {
                type: 'jsonp',
                url: GayGuideApp.jsonBase+'/ajax/json.atm.php',
                enablePagingParams: false,
                timeout: 30000,
                reader: {
                    type: 'json',
                    rootProperty: 'atm'
                }
            }
        });

        if (!GayGuideApp.ggv.atmData.isLoaded()) {
            this.log("load atm data");

            GayGuideApp.ggv.atmData.load();
        }
        /////////////////////////////////////////////////////////////////////////////
        !Ext.getStore('mainstore') &&  Ext.create(
            'GayGuideApp.store.Main',
            { storeId: 'mainstore' });
        //GayGuideApp.cards.placesList.down('list').setStore(GayGuideApp.store.placesList);

        //if (GayGuideApp.useLocalStorage) {
        //    GayGuideApp.store.placesListAssoc = GayGuideApp.store.placesListAssoc || Ext.create('GayGuideApp.store.BizEventLocal', {});
        //    GayGuideApp.store.placesListLocal = GayGuideApp.store.placesListLocal || Ext.create('GayGuideApp.store.BizLocal', {
        //        listeners: {
        //            load: this.loadMainFromLocal
        //        }
        //    });
        //}

        GayGuideApp.store.placesListOnline = GayGuideApp.store.placesListOnline || Ext.create('GayGuideApp.store.BizOnline', {
            listeners: {
                load: this.loadFromOnline
            }
        });

        GayGuideApp.store.placesListOnline.getProxy().setExtraParams({
            lang: GayGuideApp.lang || readCookie('t_lang') || 'en'
        });

        this.log("load biz");

        GayGuideApp.store.placesListOnline.load();
        
        this.log("load calendar");
        this.getEvents(GayGuideApp.today);
        /////////////////////////////////////////////////////////////////////////////
    },

    /**
     *
     *
     */
    loadFromOnline: function(store, records, success, operation) {
        var onlinestore = store,
            plc = GayGuideApp.cards.placesList && GayGuideApp.cards.placesList.down('list'),
            storeOffline = GayGuideApp.store.placesListLocal,
            storeOfflineEvents = GayGuideApp.store.placesListAssoc,
            mainstore = Ext.StoreManager.get('mainstore'),
            dataArray = [];
            
        var mainCtl = GayGuideApp.app.getApplication().getController("MainController");
        mainCtl.log("load callback biz");

        if (!success) {
            Ext.Msg.confirm('Gay Guide Vallarta',
                            'Refresh Failed<br />' +onlinestore.getProxy().getTimeout()/1000+ ' seconds<br />Try Again with longer timeout?',
                            function(value) {
                if (value == 'yes') {
                    onlinestore.getProxy().setTimeout( 10000 + (onlinestore.getProxy().getTimeout()*2) );
                    onlinestore.load();
                }
                else {
                    if (GayGuideApp.useLocalStorage) {
                        Ext.Viewport.getMasked().setMessage('Using Old Data');
                        Ext.defer(function() {
                            try {
                                GayGuideApp.store.placesListAssoc.load();
                            } catch(err) {
                                ggv_log('app.store.placesListAssoc.load(); failed', err)
                                GayGuideApp.store.placesListAssoc.removeAll();
                            }
                            GayGuideApp.store.placesListLocal.load();
                            Ext.Viewport.setMasked(false);
                        }, 1000);
                    }
                    else {
                        Ext.Viewport.setMasked(false);
                    }
                    onlinestore.destroy();
                    GayGuideApp.store.placesListOnline = null;
                }
            });
            return;
        }

        if (GayGuideApp.useLocalStorage)  {
            storeOffline.getProxy().clear();
            storeOffline.removeAll(false);
            storeOffline.sync();

            storeOfflineEvents.getProxy().clear();
            storeOfflineEvents.removeAll(false);
            storeOfflineEvents.sync();
        }

        var skipDelete = !mainstore.getCount();

        mainCtl.log("load callback biz loop starting");
        records.forEach(function (record) {
            var i=0, m, r, e = record.raw.events;

            r = record;
            r.phantom = true;
            if (GayGuideApp.useLocalStorage)  {
                if (e)  e.forEach(function(item) {
                    storeOfflineEvents.add(item);
                });
                storeOffline.add(r);
            }

            e = skipDelete ? null : mainstore.findRecord('id', r.raw.id, 0, false, false, true);
            r.raw.uuid = null;
            if (e) {
                mainstore.remove(e);
            }
            dataArray.push(r.raw);
        });
        mainCtl.log("load callback biz loop done");
        mainstore.add(dataArray);
        if (GayGuideApp.useLocalStorage)  {
            storeOffline.sync();
            storeOfflineEvents.sync();
        }

        //var records1 = mainstore.getRange();

        // build categories list
        //
        mainCtl.log("load callback biz create placesList view");
        var pls = GayGuideApp.store.placesList = GayGuideApp.store.placesList || mainstore.addView({
            name:'placeslist',
            filterFn: function(item) {
                return true;
            }
        }).store;
        pls.setGroupField('list_cat_name');
        pls.setGroupDir('ASC');
        pls.setGrouper({
            groupFn: function(record) {
                return record.get('list_cat_name');
            }
        });
        pls && pls.setSorters({
            property:  'list_name',
            root:      'data',
            direction: 'ASC'
        });

        mainCtl.log("load callback biz create search List view");

        GayGuideApp.store.sList = GayGuideApp.store.sList || mainstore.addView({
            name:'sList',
            filterFn: function(item) {
                return true;
            }
        }).store;

        GayGuideApp.store.sList.setSorters({
            sorterFn: function(a,b) {
                var gpsPosition = GayGuideApp.ggv.gpsPosition;

                if (!gpsPosition) return 0;

                var aDist = GayGuideApp.ggv.distanceBetweenPoints(gpsPosition, new google.maps.LatLng(a.data.list_latitude, a.data.list_longitude));
                var bDist = GayGuideApp.ggv.distanceBetweenPoints(gpsPosition, new google.maps.LatLng(b.data.list_latitude, b.data.list_longitude));

                if (!a.data.list_latitude &&!b.data.list_latitude ) return 0;
                if (!a.data.list_latitude) return -1;
                if (!b.data.list_latitude) return -1;
                return (aDist > bDist) ? 1 : (aDist === bDist ? 0 : -1);
            }
        });
        GayGuideApp.popups.searchPopup.down('list').setStore(GayGuideApp.store.sList);

        mainCtl.log("load callback biz create nearby List view");

        GayGuideApp.store.nList = GayGuideApp.store.nList || mainstore.addView({
            name:'nList',
            filterFn: function(item) {
                return true;
            }
        }).store;
        GayGuideApp.store.nList.setSorters({
            sorterFn: function(a,b) {
                var gpsPosition = GayGuideApp.ggv.gpsPosition;

                if (!gpsPosition) return 0;

                var aDist = GayGuideApp.ggv.distanceBetweenPoints(gpsPosition, new google.maps.LatLng(a.data.list_latitude, a.data.list_longitude));
                var bDist = GayGuideApp.ggv.distanceBetweenPoints(gpsPosition, new google.maps.LatLng(b.data.list_latitude, b.data.list_longitude));

                if (!a.data.list_latitude &&!b.data.list_latitude ) return 0;
                if (!a.data.list_latitude) return -1;
                if (!b.data.list_latitude) return -1;
                return (aDist > bDist) ? 1 : (aDist === bDist ? 0 : -1);
            }
        });
        
        // figure out catlist
        //
        mainCtl.log("load callback biz build cat list");

        var catPagesOrder = [];
        var cats = [];
        var catArray = [];
        GayGuideApp.store.placesMenu.getRange().forEach(function(record){
            var x = { catname: record.data.menuName, catcode: record.data.assocListSelect, catpage: record.data.assocListSelect, catpageorder: record.data.id};
            if (record.data.assocListSelect != '+'
             && record.data.assocListSelect != '-'
             && record.data.assocListSelect != 'alpha' ) {
                cats[x.catcode] = x;
                catPagesOrder[x.catcode] = x.catpageorder;
            }
        });
        records.forEach(function(record) {
            var catpage = (record.data.list_cat_page == '')? record.data.list_cat : record.data.list_cat_page;

            var x = {
                catname: record.data.list_cat_name,
                catcode: record.data.list_cat,
                catpage: catpage,
                catpageorder: catPagesOrder[catpage],
                catcount: 1
            };
            if (cats[x.catcode]) x.catcount = cats[x.catcode].catcount + 1;
            cats[x.catcode] = x;
        });
        for (p in cats) {
            catArray.push(cats[p])
        }
        GayGuideApp.store.catList = GayGuideApp.store.catList || Ext.create('GayGuideApp.store.CatList', {});
        GayGuideApp.store.catList.add(catArray);
        
        // calculate the tag counts in the tagList
        //
        mainCtl.log("load callback biz calcTagCounts");

        GayGuideApp.app.getApplication().getController('PlacesController').calcTagCounts();

        // copy records into favoritesList store dataview, mark favorites in this store
        //
        GayGuideApp.store.favoritesList = Ext.StoreManager.get('favsListStore');
        GayGuideApp.store.favoritesList.removeAll(true);
        GayGuideApp.store.favoritesList.sync();

        GayGuideApp.store.favorites.each(function(item) {
            if (item.data.fav || item.data.notes != "") {
                var x = false,
                    bizRecord = mainstore.findRecord('id', item.data.bid, 0, false, false, true);

                if (bizRecord) {
                    if (item.data.fav) {
                        bizRecord.set('fav', 1);
                        x = true;
                    }
                    if (item.data.notes != "") {
                        bizRecord.set('notes', item.data.notes);
                        x = true;
                    }

                    if (x) {
                        GayGuideApp.store.favoritesList.add(bizRecord);
                    }
                }
            }
        });

        GayGuideApp.store.placesListOnline.each(function(i){
            if (i.eventsStore) {
                i.eventsStore.destroy();
            }
        });
        store.destroy();
        GayGuideApp.store.placesListOnline = null;

        if (GayGuideApp.ggv.ios6) {
            GayGuideApp.store.placesListLocal.destroy();
            GayGuideApp.store.placesListLocal = null;
            GayGuideApp.store.placesListAssoc.destroy();
            GayGuideApp.store.placesListAssoc = null;
        }

        if (!GayGuideApp.store.eventsStore.isLoading()) {
            Ext.Viewport.setMasked(false);
        }

        if (plc) {
            plc.setStore(Ext.getStore('mainstore').getView('placeslist'));
            plc.refresh();
        }
        GayGuideApp.pendingRoute && GayGuideApp.app.getApplication().redirectTo(GayGuideApp.pendingRoute, true);
        GayGuideApp.pendingRoute = null;
        GayGuideApp.ggv.reloadMapMarkers();
        
        
        mainCtl.log("load biz callback done");
    },


    /**
     * getEvents(values)
     *   values - date of the events to be loaded
     *
     * fetch event data for one day from the server
     *  place selected date into view
     */
    getEvents: function (values) {
        var app = GayGuideApp,
            ggv = app.ggv,
            store = app.store.eventsStore,
            list = app.cards.eventsList && app.cards.eventsList.down('list');

        Ext.Viewport.setMasked(GayGuideApp.ggv.loadMask);

        if (list) {
            list.setLoadingText(null);
        }

        store.getProxy().setTimeout(20000);
        store.getProxy().setExtraParams({
            vsn:  2,
            lang: app.lang || readCookie('t_lang') || 'en',
            day: values.getDate(),
            month: values.getMonth()+1,
            year:  (1900 + values.getYear())
        });
        store.removeAll(true);
        store.refreshViews();
        store.load();
    },

    onOrientationChange: function(me, orientation, width, height) {
        var pd = GayGuideApp.cards.placesDetail && GayGuideApp.cards.placesDetail.down('tabpanel'),
            ed = GayGuideApp.cards.eventsDetail && GayGuideApp.cards.eventsDetail.down('tabpanel'),
            pm = GayGuideApp.cards.placesMenu,
            pl = GayGuideApp.cards.placesList,
            el = GayGuideApp.cards.eventsList,
            fl = GayGuideApp.cards.favsList,
            nl = GayGuideApp.cards.notesList,
            popup = GayGuideApp.popups.cuisineMenu;

        pm && pm.fireEvent('sizechange', pm, width, height);
        pl && pl.fireEvent('sizechange', pl, width, height);
        el && el.fireEvent('sizechange', el, width, height);
        fl && fl.fireEvent('sizechange', fl, width, height);
        nl && nl.fireEvent('sizechange', nl, width, height);
        pd && pd.fireEvent('sizechange', pd, width, height);
        ed && ed.fireEvent('sizechange', ed, width, height);

    },
    
    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(new Date().getTime()/1000);
        args.unshift('MainController')
        if (this.getDebug())
            console.log( args);
    }
});

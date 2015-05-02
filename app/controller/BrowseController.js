/*************************************************************
 * GayGuideApp.controller.BrowseController
 *
 *
 */
Ext.define("GayGuideApp.controller.BrowseController", {
    extend: "Ext.app.Controller",

    requires: [
            'Ext.Button',
            'Ext.List',
            'Ext.tab.Panel',
            'Ext.Map'
    ],

    config: {
        debug: false,
        logFrame: false,

        before:  {
            'showCuisineList':         'hello',
            'showCharacteristicsList': 'hello',
            'showNearbyList':          'hello',
            'showCategoryList':        'hello',
            'showOverviewList':        'hello'
        },

        routes: {
            'overview':          'showOverviewList',
            'catsubgroup':       'showCategoryList',
            'characteristics':   'showCharacteristicsList',
            'cuisines':          'showCuisineList',
            'nearby':            'showNearbyList'
        },

        refs: {
            browseCard:          '#browseCard',

            // toolbar buttons
            //
            browseNav:          '#browseCard > toolbar button[iconCls="list"]',
            browseGps:           '#browseCard > toolbar button[iconCls="locate1"]',

            // toolbar segmented button parts
            //
            browseChars:         '#browseCard > toolbar button[itemId="characteristicsButton"]',
            browseCuisine:       '#browseCard > toolbar button[itemId="cuisinesButton"]',
            browseCats:          '#browseCard > toolbar button[itemId="categoriesButton"]',
            browseMenu:          '#browseCard > toolbar button[itemId="overviewButton"]',
            browseNearby:        '#browseCard > toolbar button[itemId="nearbyButton"]',

            // right column 'results lists'
            //
            pList:               '#browseCard #groupedPlist',
            pList2:              '#browseCard #ungroupedPlist',

            // left column 'results list' (nearby list)
            //
            nList:               '#browseCard nearbylist'
        },

        control: {
            browseNav: {
                tap:             'doNavTap'
            },
            browseGps: {
                tap:             'doNearListGps'
            },


            browseMenu: {
                tap:             'doBrowseButtonOverview'
            },
            browseCats: {
                tap:             'doBrowseButtonCategories'
            },
            browseChars: {
                 tap:            'doBrowseButtonCharacteristics'
            },
            browseCuisine: {
                tap:             'doBrowseButtonCuisine'
            },
            browseNearby: {
                tap:             'doBrowseButtonNearby'
            },

            pList: {
                select:          'doPListSelect',
                disclose:        'doPListDisclose'
            },
            pList2: {
                select:          'doPList2Select',
                disclose:        'doPList2Disclose'
            },
            nList: {
                disclose:        'doNearListDisclose'
            }
        }
    },

    hello: function(action) {
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    /**
     * @private
     *
     *  doPListDisclose - responds to disclose button press in plist
     *
     *  issues select
     *
     */
    doPListDisclose: function(me, record) {
        this.log('doPListDisclose');
        var plist = me;

        plist.setDisableSelection(false);
        plist.deselectAll(true);
        plist.select(record);
    },

    /**
     * @private
     *
     * doPListSelect - responds to selectin plist
     *
     *  redirect to router to get placesDetail view started
     *  for the selected biz
     */
    doPListSelect: function(list, record, eOpts) {
        var activeBrowse;
        
        this.log('doPListSelect');
        if (record) {
            this.log('doPListSelect', 'restoreInProgress', list.up('browsetablet').restoreInProgress)
            if (!list.up('browsetablet').restoreInProgress) {
                var segbutton = list.up('browsetablet').down('toolbar segmentedbutton');
                segbutton.getInnerItems().forEach(function(item, index) {
                    if (segbutton.isPressed(item)) {
                        activeBrowse = item.getItemId().replace('Button', '');
                        
                        if (index == 1)  activeBrowse = 'catgroup';
                    }
                });
                this.redirectTo(activeBrowse + '/' + record.data.id);
            }
        }
    },

    /**
     * @private
     *
     *  doPListDisclose - responds to disclose button press in plist2
     *
     *  issues select
     *
     */
    doPList2Disclose: function(me, record) {
        this.log('doPList2Disclose');
        var plist = me;
        
        plist.setDisableSelection(false);
        plist.deselectAll(true);
        plist.select(record);
    },

    /**
     * @private
     *
     * doPListSelect - responds to selectin plist2
     *
     *  redirect to router to get placesDetail view started
     *  for the selected biz
     */
    doPList2Select: function(list, record, eOpts) {
        this.log('doPList2Select');
        var activeBrowse;
        if (record) {
            this.log('doPList2Select', 'restoreInProgress', list.up('browsetablet').restoreInProgress)
            if (!list.up('browsetablet').restoreInProgress) {

                var segbutton = list.up('browsetablet').down('toolbar segmentedbutton');
                segbutton.getInnerItems().forEach(function(item, index) {
                    if (segbutton.isPressed(item)) {
                        activeBrowse = item.getItemId().replace('Button', '');
                        if (index == 1)  activeBrowse = 'catsubgroup';
                    }
                });
                this.redirectTo(activeBrowse + '/' + record.data.id);
            }
        }
    },

    /**
     *
     */
    showOverviewList: function() {
        this.log('showOverviewList');
        return this.showBrowseType('overview', false);
    },

    /**
     * @private
     *
     * doBrowseButtonOverview - sets up for Overview 'placesMenu' view
     *
     *   @param me {Object} button pressed
     */
    doBrowseButtonOverview: function(me) {
        this.log('doBrowseButtonOverview', 'setting location.hash');
        location.hash = 'overview';
    },



    /**
     * @private
     *
     * doBrowseSetupOverview - sets up for Overview 'placesMenu' view
     *
     *   @param me {Object} button pressed
     */
    doBrowseSetupOverview: function(me) {
        this.log('doBrowseButtonOverview');
        var code = false,
            view = me.up('browsetablet'),
            store = GayGuideApp.store.placesMenu.getView('browseMStore'),
            list = view.down('placesmenu');

        !list.getStore() && store && list.setStore(store);
        view.showButtonActive(me);
        view.scrollToTop();
        view.clearRightSide();
        view.union = false;
        
        view.down('#locateButton').hide();
        view.down('#locateFiller').show();
        
        view.down('#browseLeftSide').setActiveItem(0);
        //GayGuideApp.ggvstate && GayGuideApp.ggvstate['browseCard'] && view.restoreState(GayGuideApp.ggvstate['browseCard']);
    },

    /**
     *
     */
    showCategoryList: function() {
        this.log('showCategoryList');
        return this.showBrowseType('catsubgroup', false);
    },

    /**
     * @private
     *
     * doBrowseButtonOverview - sets up for Categories view
     *
     *   @param me {Object} button pressed
     */
    doBrowseButtonCategories: function(me) {
        this.log('doBrowseButtonCategories', 'setting location.hash');
        location.hash = 'catsubgroup';
    },

    /**
     * @private
     *
     * doBrowseSetupCategories - sets up for Categories view
     *
     *   @param me {Object} button pressed
     */
    doBrowseSetupCategories: function(me) {
        this.log('doBrowseButtonCategories');
        var code = false,
            view = me.up('browsetablet'),
            list = view.down('catlist'),
            store = GayGuideApp.store.catList;

        list.onActivate && list.onActivate(list);
        !list.getStore() && store && list.setStore(store);

        view.showButtonActive(me);
        list.getStore() && list.deselectAll();
        
        view.down('#locateButton').hide();
        view.down('#locateFiller').show();

        view.scrollToTop();
        view.clearRightSide();
        view.union = false;
        view.down('#browseLeftSide').setActiveItem(list);

        //GayGuideApp.ggvstate && GayGuideApp.ggvstate['browseCard'] && view.restoreState(GayGuideApp.ggvstate['browseCard']);
    },

    /**
     *
     */
    showCharacteristicsList: function() {
        this.log('showCharacteristicsList');
        return this.showBrowseType('characteristics', false);
    },

    /**
     * @private
     *
     * doBrowseButtonCharacteristics - respond to button for Characteristics view
     *
     *   @param me {Object} button pressed
     */
    doBrowseButtonCharacteristics: function(me) {
        this.log('doBrowseButtonCharacteristics', 'setting location.hash');
        location.hash = 'characteristics';
    },


    /**
     * @private
     *
     * doBrowseSetupCharacteristics - sets up for Characteristics view
     *
     *   @param me {Object} button pressed
     */
    doBrowseSetupCharacteristics: function(me) {

        this.log('doBrowseButtonCharacteristics');
        var view = me.up('browsetablet'),
            list = view.down('taglist'),
            store = GayGuideApp.store.tags;

        list.onActivate && list.onActivate(list);
        !list.getStore() && store && list.setStore(store);
        view.showButtonActive(me);

        if (store) {
            store.clearFilter(false);
            list.deselectAll();
            store.filterBy(function(record, id) {
                return (record.data.codeGroup != 5);
            });
        }
        
        view.down('#locateButton').hide();
        view.down('#locateFiller').show();

        list.setMode('MULTI');
        view.union = false;

        view.scrollToTop();
        view.clearRightSide();
        view.down('#browseLeftSide').setActiveItem(list);

        //GayGuideApp.ggvstate && GayGuideApp.ggvstate['browseCard'] && view.restoreState(GayGuideApp.ggvstate['browseCard']);
    },

    /**
     *
     */
    showCuisineList: function() {
        this.log('showCuisineList');
        return this.showBrowseType('cuisines', false);
    },

        /**
     * @private
     *
     * doBrowseButtonCuisine - sets up for Cuisine view
     *
     *   @param me {Object} button pressed
     */
    doBrowseButtonCuisine: function(me) {
        this.log('doBrowseButtonCuisine', 'setting location.hash');
        location.hash = 'cuisines';
    },

    /**
     * @private
     *
     * doBrowseButtonCuisine - sets up for Cuisine view
     *
     *   @param me {Object} button pressed
     */
    doBrowseSetupCuisine: function(me) {
        this.log('doBrowseButtonCuisine');
        var code = true,
            view = me.up('browsetablet'),
            list = view.down('taglist'),
            store = GayGuideApp.store.tags;

        list.onActivate && !list.isActivated() && list.onActivate(list);
        !list.getStore() && store && list.setStore(store);
        view.showButtonActive(me);

        if (store) {
            store.clearFilter(false);
            list.deselectAll();
            store.filterBy(function(record, id) {
                return (record.data.codeGroup == 5) ;
            });
        }

        view.down('#locateButton').hide();
        view.down('#locateFiller').show();

        list.setMode('MULTI');
        view.union = false;

        view.scrollToTop();
        view.clearRightSide();
        view.down('#browseLeftSide').setActiveItem(list);
        //GayGuideApp.ggvstate && GayGuideApp.ggvstate['browseCard'] && view.restoreState(GayGuideApp.ggvstate['browseCard']);
    },

    /**
     *
     */
    showNearbyList: function() {
        this.log('showNearbyList');
        try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {}
        return this.showBrowseType('nearby', false);
    },

    /**
     * @private
     *
     * doBrowseButtonNearby - sets up for Nearby
     *
     *   @param me {Object} button pressed
     */
    doBrowseButtonNearby: function(me) {
        this.log('doBrowseButtonNearby', 'setting location.hash');
        location.hash = 'nearby';
    },

    /**
     * @private
     *
     * doBrowseButtonNearby - sets up for Nearby
     *
     *   @param me {Object} button pressed
     */
    doBrowseSetupNearby: function(me) {
        this.log('doBrowseButtonNearby');
        var code = false,
            view = me.up('browsetablet'),
            nearbylist = view.down('nearbylist'),
            nearbymap = view.down('markermap');

        if (GayGuideApp.ggv.gps == 'off')
            Ext.Msg.confirm('Gay Guide Vallarta', 'Enable Location Services?', this.enableLocation, this);

        // maybe we are jumping the gun here on this
        //
        if (GayGuideApp.ggv.gps != 'off') GayGuideApp.ggv.doGeoUpdate();

        view.down('#locateButton').show();
        view.down('#locateFiller').hide();
        
        view.showButtonActive(me);
        view.union = false;
        view.scrollToTop();
        view.clearRightSide();

        nearbylist.getStore() && nearbylist.deselectAll(true);

        try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {}

        view.down('#browseLeftSide').setActiveItem(3);

        var rs = view.down('#browseRightSide');
        var mapC = rs.down('#nearMap');
        Ext.defer(function() {
            rs.animateActiveItem(mapC, {
                type:      'slide',
                direction: 'right',
                duration:  500
            });
        }, 500, this);
    },

    /**
     * @private
     *
     * doNearListDisclose - responds to disclose button in nList
     */
    doNearListDisclose: function(me, record) {
        this.log('doNearListDisclose');
         this.redirectTo('nearby/' + record.data.id);
    },

    /**
     * showBrowseType -
     *
     * shows showBrowseType view
     *
     *   responds to router from Places Directory MainMenu list,
     *   shows the showBrowseType view with proper filtering of the tags
     *   loads browse card and associated data stores
     */
    showBrowseType: function(type, union) {
        this.getLogFrame() && console.log('>>>>>>>>>> showBrowseType', type, this.getLogFrame() );
        this.log('showBrowseType');
        var code = (type == 'placescuisine');

        if (GayGuideApp.store.tags) {
            GayGuideApp.store.tags.clearFilter(false);
            GayGuideApp.store.tags.filterBy(function(record, id) {
                if (code)
                    return (record.data.codeGroup == 5) ;
                return  (record.data.codeGroup != 5)
            });
        }
        if (!GayGuideApp.ggv.tryRouteReady(type)) return false;
        reportView('/touch/#placestags', 'Places Tag List');
        
        
        // create things; if not done yet
        //
        var browseCard = GayGuideApp.cards.browseCard;
        if (!browseCard) {
            browseCard = GayGuideApp.cards.browseCard = Ext.create(
                'GayGuideApp.view.tablet.BrowseTablet', {
                }
            );
            Ux.locale.Manager.applyLocales();
        }

        var nav           = Ext.Viewport.down('slidenavigationview'),
            target        = nav.container,
            activeItem    = target.getActiveItem(),
            mainStore     = Ext.getStore('mainstore'), //GayGuideApp.store.placesList,
            tagListStore  = GayGuideApp.store.tags,
            catListStore  = GayGuideApp.store.catList,
            nearListStore = GayGuideApp.store.nList,
            sy = 0, x;
            
        // close nav slide aside container
        //
        if (target.getActiveItem() == browseCard) {
            nav.afterActionCloseRequested(nav);
        }
        
        // set main nav to reflect where we are, close the slide container
        //
        nav.list.deselectAll(true, true);
        nav.list.select(2, false, true);

        // bind stores to the dataviews in left column, creating them if needed
        //
        if (type == 'overview') {
            var  mList = browseCard.down('#overview');
            if (!mList) console.log('showBrowseType','overview', 'NO LIST');
            if ((type == 'overview') && mList && !mList.getStore()) {
                
                this.log('showBrowseType', ' addView setStore', 'browseMStore');
                var store = GayGuideApp.store.placesMenu.getView('browseMStore');
                store = !store && GayGuideApp.store.placesMenu.addView({
                    name:'browseMStore',
                    filterFn: function(item) {
                        switch(item.data.assocListSelect) {
                            case '+':
                            case '-':
                            case 'alpha':
                                return false;
                            default:
                                return true;
                        }
                    }
                }).store
                mList.setStore(store);
            }
        }

        if ((type == 'catsubgroup')
            && !browseCard.down('catlist').getStore() && catListStore) {
                browseCard.down('catlist').setStore(catListStore);
        }

        if (((type == 'cuisines') || (type == 'characteristics'))
            && !browseCard.down('taglist').getStore() && tagListStore) {
                browseCard.down('taglist').setStore(tagListStore);
        }
        if ((type == 'nearby')
            && !browseCard.down('nearbylist').getStore() && nearListStore) {
                browseCard.down('nearbylist').setStore(nearListStore);
        }

        // add the browse card to the main container (if needed)
        //
        if (!nav.container.down('#browseCard')) {
            nav.container.add([browseCard]);
        }

        // bind stores to the dataviews in right column, creating them if needed
        //
        if (type == 'catsubgroup') {

            if (mainStore.getFilters().length)
                mainStore.clearFilter();

            var  pList2 = browseCard.down('#ungroupedPlist');
            if (!pList2.getStore()) {
                var ungroupedStore = mainStore.getView('ungrouped') || mainStore.addView({
                    name:'ungrouped',
                    filterFn: function() {
                        return true;
                    }
                }).store;

                ungroupedStore && ungroupedStore.setSorters({
                    property:  'list_name',
                    root:      'data',
                    direction: 'ASC'});
                pList2.setStore(ungroupedStore);
            }
        }

        if ((type == 'overview')
         || (type == 'catsubgroup')
         || (type == 'characteristics')
         || (type == 'cuisines')) {

            if (mainStore.getFilters().length)
                mainStore.clearFilter();

            var  pList = browseCard.down('#groupedPlist');
            if (!pList.getStore()) {
                var groupedStore = mainStore.getView('grouped') || mainStore.addView({
                    name:'grouped',
                    filterFn: function() {
                        return true;
                    }
                }).store;

                groupedStore.setGroupField('list_cat_name');
                groupedStore.setGroupDir('ASC');
                groupedStore.setGrouper({
                    groupFn: function(record) {
                        return record.get('list_cat_name');
                    }
                });
                groupedStore.setSorters({
                    property:  'list_name',
                    root:      'data',
                    direction: 'ASC'
                });
                pList.setStore(groupedStore);
            }
        }
        browseCard.scrollToTop();
        if (target.getActiveItem().getItemId() != 'placesDetailContainer') {
            target.animateActiveItem(browseCard, { type: 'fade' });
        }
        else {
            target.animateActiveItem(browseCard, { type: 'slide', direction: 'right' });
        }

        if (type == 'overview') {
            this.doBrowseSetupOverview(browseCard.query('segmentedbutton button')[0]);
        }
        else if (type == 'catsubgroup') {
            this.doBrowseSetupCategories(browseCard.query('segmentedbutton button')[1]);
        }
        else if (type == 'characteristics') {
            this.doBrowseSetupCharacteristics(browseCard.query('segmentedbutton button')[2]);
        }
        else if (type == 'cuisines') {
            this.doBrowseSetupCuisine(browseCard.query('segmentedbutton button')[3]);
        }
        else if (type == 'nearby') {
            this.doBrowseSetupNearby(browseCard.query('segmentedbutton button')[4]);
        }
        browseCard._mainnav = false;

        if (GayGuideApp.ggvstate && GayGuideApp.ggvstate['browseCard'] ) {
            Ext.defer(function() {
                browseCard.restoreState(GayGuideApp.ggvstate['browseCard']);
                GayGuideApp.ggvstate['browseCard'] = null;
            }, 50);
        }
        return true;
    },

    /**
     *
     */
    doNearListGps: function(me) {
        this.log('doNearListGps');
        try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {};

        var gmap = me.up('browsetablet').down('map').getMap(),
            psn = GayGuideApp.ggv.gpsPosition;

        if (!gmap) return;

        if (GayGuideApp.ggv.gps != 'off') {
            if (psn) {
                gmap.panTo(psn);
            }
            GayGuideApp.ggv.geo.updateLocation(function(geo){
                if (geo) {
                    gmap.panTo(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()));
                }
            });
        }
    },

    /**
     *
     */
    enableLocation: function(value) {
        this.log('enableLocation');
        if (value != 'yes') return;
        var x = GayGuideApp.cards.viewport.container.down('#SettingsContainer');

        if (!x) {
            x = GayGuideApp.cards.viewport.container.add({
                xtype:  'container-lite',
                id:     'SettingsContainer',
                layout: 'card',
                items:  [{ xtype: GayGuideApp.isTablet() ? 'settingstablet' : 'settings' }],
                slideButton: { selector:  'titlebar' }
        });
        }
        x.onActivate &&  x.onActivate(x);
        x.down('#gpsEnabled').setValue(true);
    },

    /**
     * @private
     *
     * Open the slideNavigation
     *   responds the button tap
     *
     *   @param {Ext.Button} me The button that was pressed.
     *   @param {Ext.EventObject} e The event object.
     *
     */
    doNavTap: function(me, e, eOpts) {
        this.log('doNavTap');
        var view = me.up('slidenavigationview');

        Ext.callback(view.toggleContainer, view, [], 0);
    },

    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('BrowseController');
        if (this.getDebug())
            console.log(args);
    }
});

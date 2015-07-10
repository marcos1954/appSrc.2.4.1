/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext':      'touch/src',
    'Ext.ux':   'Ux',
    'Ux':       './Ux',
    'default':  'app'
});
Ext.Loader.setConfig({
    enabled: true,
    disableCaching : false
});
//</debug>

/**
 * Root application for Gay Guide App
 *
 */
Ext.application({
    name: 'GayGuideApp',

    requires: [
        
        'GayGuideApp.controller.override.Application',
        'GayGuideApp.controller.override.History',
        'GayGuideApp.controller.override.Map',
        'GayGuideApp.controller.override.List',
        //'GayGuideApp.controller.override.Img',
        'GayGuideApp.controller.override.PaintMonitor',
        'GayGuideApp.controller.override.SizeMonitor',
        
        'Ext.MessageBox',
        'Ext.DateExtras',
        
        'Ux.homescreen.HomeScreen',
        'Ux.storeview.StoreView',
        'Ux.locale.Manager',
        'Ux.locale.override.st.Component',
        'Ux.locale.override.st.Button',
        'Ux.locale.override.st.Container',
        'Ux.locale.override.st.TitleBar',
        'Ux.locale.override.st.field.Field',
        'Ux.locale.override.st.form.FieldSet',
        'Ux.locale.override.st.picker.Picker',
        'Ux.slidenavigation.View',
        
        'Ext.event.publisher.TouchGesture',
        'Ext.event.recognizer.Drag',
        'Ext.event.recognizer.DoubleTap',
        'Ext.event.recognizer.Swipe',
        'Ext.event.recognizer.Pinch',
        'Ext.event.recognizer.Rotate',
        'Ext.event.recognizer.EdgeSwipe',
        'Ext.event.publisher.ComponentDelegation',
        'Ext.event.publisher.ComponentPaint',
        'Ext.event.publisher.ElementPaint',
        'Ext.event.publisher.ElementSize'
    ],

    profiles: [
        'Tablet',
        'Phone'
    ],

    models:[
    'Ads',
        'Atm',
        'BaseModel',
        'Business',
        'Event',
        'Favorites',
        'Menu',
        'Tags',
        'Today',
        'Cats'
    ],

    views: [
        'ContainerLite',
        'ListLite',
        
        'GalleryItem',
        
        'CacheMap',
        'MainMapView',
        'GayGuideMap',
        'MarkerMap',
        'MapIconSidebar',

        'PlacesEvents',
        'PlacesInfo',
        'PlacesMap',
        'PlacesMenu',
        'PlacesList',
        
        'EventsList',
        
        'CatList',
        'PList',
        'TagList',
        'Nearby',
        
        'SearchFormField',
        'SearchPopup',
        'BottomAd',
        'phone.PhoneStatusBar',
        'phone.PlacesMenu',
        'phone.PlacesPixMenu',

        
        
        'phone.PlacesDetailContainer',
        'phone.EventsDetailContainer',
        'phone.DetailPhone',
        'phone.FavsList',
        'phone.Main',
        'phone.MapPanZoomMenu',
        'phone.Mapa',
        'phone.NotesListPhone',
        'phone.RecentsListPhone',
        'phone.PhoneEventsDetail',
        'phone.PhoneEventsList',
        'phone.PhoneViewport',
        'phone.PlacesListPhone',
        'phone.Settings',
        
        'tablet.BrowseTablet',
        'tablet.DetailTablet',
        'tablet.PlacesCombo',
        'tablet.EventsDetailTablet',
        'tablet.EventsDetailContainer',
        'tablet.EventsListTablet',
        'tablet.FavsList',
        'tablet.GalleryTablet',
        'tablet.Main',
        'tablet.MapaTablet',
        'tablet.Notes',
        'tablet.NotesListTablet',
        'tablet.RecentsListTablet',
        'tablet.PlacesPhotoBar',
        'tablet.PlacesListTablet',
        'tablet.PlacesMenuTablet',
        'tablet.PlacesDetailContainer',
        'tablet.EventsDetailContainer',
        'tablet.Settings'
    ],

    stores: [
        'EventsStore',
        'Favorites',
        'FavoritesData',
        'Menu',
        'RecentsStore',
        'CatList',
        'BizEventLocal',
        'BizLocal',
        'BizOnline',
        'Main'
    ],

    controllers: [
        'DetailController',
        'EventsController',
        'FavsController',
        'GalleryController',
        'MainController',
        'MapaController',
        'PlacesController',
        'AdController',
        'BrowseController'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460'  : 'resources/startup/320x460.jpg',
        '640x920'  : 'resources/startup/640x920.png',
        '640x1096' : 'resources/startup/640x1096.png',
        '768x1004' : 'resources/startup/768x1004.png',
        '748x1024' : 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },
    
    statusBarStyle: 'black',

    eventPublishers : {
        touchGesture : {
            recognizers : {
                tap : {
                    xclass:       'Ext.event.recognizer.Tap',
                    moveDistance: 60 //8 should be default
                },
                longpress: {
                    xclass:       'Ext.event.recognizer.LongPress',
                    minDuration:  200
                }
            }
        }
    },

    /*
     * see MainController init() and launch() for real launch sequence
     *
     * this only takes down the initial Vallarta APP Forge screen one second after
     * primary launch.
     *
     */
    launch: function() {
        console.log('ggvApp.v2.4.1  production');
        //alert('launch');
        
        if (typeof StatusBar   !== 'undefined') {
            cordova.exec.setJsToNativeBridgeMode(cordova.exec.jsToNativeModes.XHR_NO_PAYLOAD);
            //StatusBar.overlaysWebView(false);
            StatusBar.styleBlackOpaque();
            
            if (navigator.splashscreen && navigator.splashscreen.hide) {
                setTimeout(function() {
                    navigator.splashscreen.hide();
                }, 2000);
            }
        }
        
        Ext.defer(function() {Ext.fly('appLoadingIndicator').destroy();}, 3000);
        Ext.Viewport.bodyElement.on( 'resize', Ext.emptyFn, this, { buffer: 1} );
        
        //alert('end main launch');
    },

    onUpdated: function() {
        Ext.Msg.show({
            title:   trans("ApplicationUpdate"),
            message: trans("ApplicationUpdateQuestion"),
            width:   300,
            buttons: [
                {enableLocale: true, locales: { text: 'buttons.no' },  itemId: 'no'},
                {enableLocale: true, locales: { text: 'buttons.yes' }, itemId: 'yes', ui: 'action'}
            ],
            fn: function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        });
    }
});

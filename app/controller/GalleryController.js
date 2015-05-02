/**
 * GayGuideApp.controller.GalleryController
 *
 *
 *
 *
 *
 */
Ext.define("GayGuideApp.controller.GalleryController", {
    extend: "Ext.app.Controller",

    requires: [
        'GayGuideApp.view.GalleryItem'
    ],

    config: {
        debug: false,
        routes: {
            'gallery':                 'showGallery',
            'gallery/cat/:cat':        'showGrp',
            'gallery/biz/:id':         'showBiz',
            'gallery/dir/:dir':        'showDir'
        },

        before: {
            'showGallery':  'hello',
            'showGrp':      'hello',
            'showBiz':      'hello',
            'showDir':      'hello'
        },

        refs: {
            galleryItem:    'galleryitem > img[name="pix"]',
            thumbItem:      '#GalleryThumbsContainer > img',
            galleryBack:    'gallerytablet > toolbar > button[itemId="galleryBack"]',
            galleryMore:    'gallerytablet > toolbar > button[itemId="menuMore"]',
            galleryBizMore: 'gallerytablet > toolbar > button[itemId="galleryListing"]',
            gallery:        'gallerytablet',
            galleryInner:   'gallerytablet > container'

        },
        control: {
            gallery: {
                initialize:        'doGalleryIndex',
                activeitemchange:  'doActiveItemChange'
            },
            galleryBack: {
                tap:               'doGalleryBack'
            },
            galleryMore: {
                tap:               'doMoreToggleTitlebar'
            },
            galleryItem: {
                tap:               'doGalleryItemTap'
            },
            thumbItem: {
                tap:               'doGalleryThumbTap'
            },
            galleryBizMore: {
                tap:               'doBizMoreInfoTap'
            }
        }
    },

    /**
     * @static
     *
     *
     */
    placesData: [
                {   code: 'D',  name: 'Daylife',     src:  'folder.png' },
                {   code: 'N',  name: 'Nightlife',   src:  'folder.png' },
                {   code: 'Y',  name: 'Gym - Spa',   src:  'folder.png' },
                {   code: 'R',  name: 'Restaurants', src:  'folder.png' },
                {   code: 'G',  name: 'Galleries',   src:  'folder.png' },
                {   code: 'S',  name: 'Shopping',    src:  'folder.png' },
                {   code: 'Z',  name: 'Services',    src:  'folder.png' },
                {   code: 'H',  name: 'Lodging',     src:  'folder.png' }],


    ////////////////////////////////////////////////////////////////////

    hello: function(action) {
        this.log("BEFORE", action.getUrl(), action.getAction());
        if (!GayGuideApp.ggv.tryRouteReady(action.getUrl())) return;
        action.resume();
    },

    showBefore: function(route) {
        this.log('showBefore');
        reportView('/touch/#'+route, 'Photo Gallery: '+route);

        var     target = GayGuideApp.cards.viewport.container,
            config = { id: 'GalleryContainer' , layout: 'card'};

        if (!GayGuideApp.ios6) {
            config = Ext.merge(config, {
                styleHtml: true,
                html: '<div style="margin: 200px auto 0 auto; font-size: 1.5em;" ><center>'+ trans('sorryNoGallery')+'</center></div>'
            });
        }

        var x = target.down('#GalleryContainer')  ||
            target.add(Ext.create('GayGuideApp.view.ContainerLite',  config));

        x.onActivate(x);

        if (GayGuideApp.ios6  && !x.down('gallerytablet')) {
            x.add(Ext.create('GayGuideApp.view.tablet.GalleryTablet',  {}));
        }

        if (target.getActiveItem() == GayGuideApp.cards.placesDetail) {
            target.animateActiveItem(x, {
                type: 'slide',
                direction: 'right'
            });
        }
        else {
            target.setActiveItem(x);
        }
        return x;
    },

    /**
     * handler responding to route: '#gallery'
     *
     * @returns
     *
     */
    showGallery: function() {
        this.log('showGallery');
        var     me = this,
            container = me.showBefore('gallery'),
            gallery = null;

        if (!container) return;
        GayGuideApp.ggv.clearStatusBar();


        gallery = container.down('gallerytablet');

        if (!GayGuideApp.store.galleryDirs.isLoaded()) {
            GayGuideApp.store.galleryDirs.removeAll(false);
            GayGuideApp.store.galleryDirs.load(function(records, operation, success) {
                if (success)
                    GayGuideApp.app.getApplication().getController('GalleryController').doGalleryIndex(gallery);
            }, this);
        }
        else {
            me.doGalleryIndex(gallery);
        }
    },

    /**
     * showGrp
     *
     *
     *
     */
    showGrp: function(cat) {
        this.log('showGrp');
        var me = this,
            container = me.showBefore('gallery/cat/'+cat),
            gallery = null;

        if (!container) return;
        //GayGuideApp.ggv.clearStatusBar();
        
        gallery = container.down('gallerytablet');
        me.placesData.forEach(function(item, index) {
            if (item.code == cat) {
                var statusBar = Ext.Viewport.down('#mainStatusBar');
                statusBar && statusBar.clearAll().setRight(item.name).setLeft('Gallery');
                gallery.down('toolbar').setTitle( item.name );
                me.doListGrpLoad(gallery, item);
            }
        });
    },

    /**
     * showBiz
     *
     *
     *this.doCarouselLoadBizPix(gallery, record);
     */
    showBiz: function(id) {
        this.log('showBiz');
        var me = this,
            container = me.showBefore('gallery/biz/'+id),
            gallery = null;

        if (!container) return;
        gallery = container.down('gallerytablet');
        GayGuideApp.ggv.clearStatusBar();

        me.doCarouselLoadBizPix(gallery, id);
    },


    /**
     * showDir
     *
     *
     */
    showDir: function(id) {
        this.log('showDir');
        var me = this,
            container = me.showBefore('gallery/dir/'+id),
            gallery = null;

        if (!container) return;
        GayGuideApp.ggv.clearStatusBar();

        gallery = container.down('gallerytablet');
        me.doCarouselLoadDirPix(gallery, id);
    },

    ////////////////////////////////////////////////////////////////////

    /*
     * doBizMoreInfoTap ---> placesDetail
     *
     *  in a gallery 'listing' from a biz we can go to detail card for that listing
     */
    doBizMoreInfoTap: function(me) {
        this.log('doBizMoreInfoTap');
        this.redirectTo( 'gallerybiz/' + me.up('gallerytablet').udata.record.data.id, true );
    },


    /**
     * doGalleryItemTap
     *
     *  respond to tap of gallery items
     */
    doGalleryItemTap: function(me, event, eopt) {
        this.log('doGalleryItemTap');
        if (event.touches.length > 0) return;

        var gallery = me.up('gallerytablet'),
            udata = me.up('galleryitem').udata,
            record = udata.record,
            type   = udata.type;

        if (type == 'listing') {
            this.redirectTo('gallery/biz/'+udata.id, true)
        }
        else if (type == 'dir') {
            this.redirectTo('gallery/dir/'+record.data.dirname, true);
        }
        else if (type == 'listgrp') {
            this.redirectTo('gallery/cat/'+record.code, true)
        }
    },

    /**
     * doGalleryThumbTap
     *
     * respond to tap of a plain gallery thumbnail
     *
     */
    doGalleryThumbTap: function(me, event, eopt) {
        this.log('doGalleryThumbTap');
        if (event.touches.length > 0) return;

        var gallery = me.up('gallerytablet'),
            carousel = gallery.down('#galleryCarouselView');

            this.log('doGalleryThumbTap: ', me, event, eopt);

        carousel.setActiveItem(parseInt(me.getItemId().split('-')[2]));

        gallery.setActiveItem(carousel);
    },

    ////////////////////////////////////////////////////////////////////

    /**
     * doMoreToggleTitlebar
     *
     *
     * respond to tap of main menu button that opens the facebook style menu,
     *  (only at root level in gallery, else back button)
     */
    doMoreToggleTitlebar: function(me, event, eopt) {
        this.log('doMoreToggleTitlebar');
        if (event.touches.length > 0) return;

        var     c = me.up('slidenavigationview');

        Ext.callback(c.toggleContainer,c,[],0);
    },

    /**
     * doGalleryBack
     *
     * respond to tap of back button in gallery
     *
     */
    doGalleryBack: function(me, event, eopt) {
        this.log('doGalleryBack');
        if (event.touches.length > 0) return;
        this.getApplication().getHistory().back();
    },

    /**
     *
     *
     */
    doActiveItemChange: function(me, newitem, olditem) {
        this.log('doActiveItemChange');
        var ctl = me.up('slidenavigationview');

        ctl && ctl.fireEvent('closerequest', ctl);
    },

    ////////////////////////////////////////////////////////////////////

    /**
     * doGalleryIndex
     *
     * creates and loads pix in root gallery view
     *
     * MUST separate the overall init from the loading of the root card (galleryInnerContainer)
     *   galleryInnerContainer - needs a new name!!
     *   doGalleryInit - needs a new name, too!!!
     *
     */
    doGalleryIndex: function (gallery) {
        this.log('doGalleryIndex');
        if (!gallery) return;

        var me = gallery.down('#GalleryInnerContainer'),
            store = GayGuideApp.store.placesList,
            dirstore = GayGuideApp.store.galleryDirs,
            favstore  = GayGuideApp.store.favoritesList,

            galeryItemConfig = {
                xtype: 'galleryitem',
                style:  GayGuideApp.isTablet() ? "float: left;  margin: 10px;" : "float: left;  margin: 5px;"  ,
                width: GayGuideApp.isTablet() ? 150 : 150
            };

        if (!me) {
            me = gallery.add({
                itemId:         'GalleryInnerContainer',
                //xtype:          'container',
                xtype:          'container-lite',
                scrollable:     'vertical',
                style:          'margin: auto !important; text-align: center;background-color: #ddd;'
            });
        }
        else {
            me.removeAll(true, true);
        }

        if (dirstore.getCount()) {
            me.add([{
                xtype:  'spacer',
                html:   '<div class="ggv-header">'+
                    Ux.locale.Manager.get('gallery.group.albums', 'Photo Albums') +
                    '</div>'
            }]);

            dirstore.each(function(record, index, x) {
                if (me.items.length <60  && record.data.pix) {
                    var y = me.add([galeryItemConfig]);
                    y.udata = { record: record, type: 'dir' };
                    y.setSrc('http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src='+record.data.pix.replace('http://www.gayguidevallarta.com',''));
                    y.setHtml(Ext.String.ellipsis(record.data.name, 25, true));
                }
            });
        }

        if (favstore.getCount()) {
            me.add([{
                xtype: 'spacer',
                html: '<br clear="all" /><div class="ggv-header">'+
                    Ux.locale.Manager.get('gallery.group.favs', 'Favorited Businesses')+'</div>'
            }]);

            favstore.each(function(record, index, x) {
                if (me.items.length < 60  && record.data.list_pix1) {
                    var y = me.add([galeryItemConfig]);
                    y.udata = { id: record.data.id, type: 'listing' };
                    y.setSrc('http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src='+
                        record.data.list_pix1.replace('http://www.gayguidevallarta.com',''));
                    y.setHtml(Ext.String.ellipsis(record.data.list_name, 20, true));
                }
            });
        }

        if (this.placesData) {
            me.add([{
                xtype: 'spacer',
                html:  '<br clear="all" /><div class="ggv-header">'+
                    Ux.locale.Manager.get('gallery.group.biz', 'Business Categories')+
                    '</div>'
            }]);

            this.placesData.forEach(function(item, index) {
                if (me.items.length < 60) {
                    var y = me.add([galeryItemConfig]);
                    y.udata = { record: item, type: 'listgrp' };
                    y.setSrc('http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src=/images/'+item.src);
                    y.setHtml(item.name);
                }
            });
        }

        gallery.down('toolbar').setTitle(Ux.locale.Manager.get('gallery.toolbar.title', 'Gallery'));
        gallery.down('toolbar > #menuMore').show();
        gallery.down('toolbar > #galleryBack').hide();
        gallery.down('toolbar > #galleryListing').hide();


        gallery.setActiveItem(me);
    },

    ////////////////////////////////////////////////////////////////////

    /**
     * doListGrpLoad
     *
     *  responds to a tap of a listing group in gallery
     *  loads a container with all the biz in the group
     *  one image per biz, subtitled with biz name
     *
     *  newName?  doCatLoadPix
     *
     */
    doListGrpLoad: function(me, record) {
        this.log('doListGrpLoad', me, record);
        var store = GayGuideApp.store.placesList,
            listGrp = me.down('#GalleryListGrpContainer') || me.add({
                itemId:     'GalleryListGrpContainer',
                //xtype:      'container',
                xtype:      'container-lite',
                scrollable: 'vertical',
                style:      'margin: auto !important; text-align: center;',
                indicator:  true
            });

        listGrp.onActivate && listGrp.onActivate(listGrp);
        listGrp.removeAll(true, true);
        listGrp.myTitle = record.name;

        store.clearFilter(true);
        store.filter([{ property: 'list_cat_page', value: record.code }])
        store.each(function(record, index, x) {
            var y;

            if (listGrp.items.length < 70  && record.data.list_pix1) {
                y = listGrp.add([GayGuideApp.isTablet()?{
                    xtype: 'galleryitem',
                    style:  "float: left; margin: 10px;",
                    width: 150
                }:{
                    xtype:  'galleryitem',
                    style:  "float: left; margin: 5px;",
                    width:  150
                }]);
                y.udata = {
                    id: record.data.id,
                    type:   'listing'
                };
                y.setSrc('http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src='+record.data.list_pix1);
                y.setHtml(Ext.String.ellipsis(record.data.list_name, 20, true));
            }
        });

        me.down('#GalleryToolbar > #menuMore').hide();
        me.down('#GalleryToolbar > #galleryBack').show();

        me.down('#GalleryToolbar').setTitle(GayGuideApp.isTablet()?record.name:'');
        var statusBar = Ext.Viewport.down('#mainStatusBar');
        statusBar && statusBar.clearAll().setRight(record.name).setLeft('Gallery');
        
        me.setActiveItem(listGrp);
    },

    ////////////////////////////////////////////////////////////////////

    /*
     * doCarouselLoadBizPix
     *
     * same problem as above, name does not fit
     *
     * new Name doBizLoadPix
     *
     * load carousel and thumb views with a biz listings data
     *   @param me - 'gallerytablet' root of gallery
     *
     */
    doCarouselLoadBizPix: function(me, id) {
        this.log('doCarouselLoadBizPix', me, id);
        var store      = GayGuideApp.store.placesList,
            thumbPanel = me.down('#GalleryThumbsContainer'),
            carousel   = me.down('#galleryCarouselView'),
            i,j,k,record,imgSrc150,imgSrcLarge,carouselItems=[],thumbItems=[];

        store.clearFilter(true);
        record = store.findRecord('id', id, 0, false, false, true);
        if (!record) return;

        me.udata = {record: record};

        thumbPanel.lastView = me.getActiveItem();
        thumbPanel.lastTitle  = GayGuideApp.isTablet()
            ?me.getParent().down('#GalleryToolbar').getTitle().getTitle()
            :GayGuideApp.ggv.getStatusBar();

        thumbPanel.removeAll(true, true);
        carousel.removeAll(true, false);

        for (i = 1; i < 10; i++)
        {
            j = eval('record.data.list_pix' + i);
            j = j && j.replace('http://www.gayguidevallarta.com','');
            k = 'http://www.gayguidevallarta.com/img.io/timthumb.php?';
            
            imgSrc150   = k + 'h=150&w=150&src=' + j;
            imgSrcLarge = k + 'h=1024&w=1024&src=' + j;
  
            if (j) {
                thumbItems.push(GayGuideApp.isTablet()?{
                    xtype:  'img',
                    mode:   'background',
                    style:  "float: left; margin: 10px;",
                    src:    imgSrc150,
                    height: 150,
                    width:  150,
                    itemId: 'ggv-thumb-' + (i-1)
                }:{
                    xtype:  'img',
                    mode:   'background',
                    src:    imgSrc150,
                    style:  "float: left; margin: 5px;",
                    height: 150,
                    width:  150,
                    itemId: 'ggv-thumb-' + (i-1)
                });

                carouselItems.push({
                    xtype:          'imageviewer',
                    style:          'background-color: #333',
                    imageSrc:       imgSrcLarge,
                    layout:         'fit',
                    loadingMessage: Ux.locale.Manager.get("misc.loadLocaleMsg", "Loading ..."),
                    errorImage:     'resources/images/NoImage.png'
                });
            }
        }

        carousel.setItems(carouselItems);
        carousel.setActiveItem(0);

        thumbPanel.setItems(thumbItems);
        thumbPanel.setActiveItem(0);

        //GayGuideApp.ggv.setStatusBar(record.data.list_name);
        
        var statusBar = Ext.Viewport.down('#mainStatusBar');
        statusBar && statusBar.clearAll().setRight(record.data.list_name).setLeft('Gallery');
        
        me.down('toolbar > #menuMore').hide();
        me.down('toolbar > #galleryBack').show();
        me.down('toolbar > #galleryListing').show();
        
        me.down('toolbar').setTitle(
            GayGuideApp.isTablet()
             ?(Ux.locale.Manager.get('gallery.toolbar.album', 'Gallery Album: ') + record.data.list_name)
             :'');

        me.setActiveItem(thumbPanel);
    },

    ////////////////////////////////////////////////////////////////////

    /**
     * doCarouselLoadDirPix
     *
     * load carousel view AND thumbnail view
     *   from a remote directory
     *
     * problem name is wrong, now does both views
     * new Name? doDirLoadPix
     *
     */
    doCarouselLoadDirPix: function (me, id) {
        this.log('doCarouselLoadDirPix: ', me, record);
        var store = GayGuideApp.store.galleryDirs,
            thumbs = me.down('#GalleryThumbsContainer'),
            carousel = me.down('#galleryCarouselView');

        thumbs.removeAll(true, true);
        carousel.removeAll(true, false);

        store.clearFilter(true);
        var record = store.findRecord('dirname', id, 0, false, false, true);
        if (!record) return;

        /*
         * define data model for dir response
         *
         *  NOTE: needs to not be dynamic.  make like other models
         *
         */
        if (!Ext.ModelManager.getModel('GayGuideApp.model.GalleryPix')) {
            Ext.define('GayGuideApp.model.GalleryPix', {
                extend: 'Ext.data.Model',
                config:  {
                    fields: [{
                        name: "name", type: 'string'
                    },{
                        name: "size", type: 'string'
                    },{
                        name: "date", type: 'string'
                    },{
                        name: "path", type: 'string'
                    },{
                        name: "file", type: 'string'
                    }]
                }
            });
        }

        /**
         * remove dynamic nature of this like the model above
         */
        GayGuideApp.store.galleryThumbs = GayGuideApp.store.galleryThumbs || Ext.create('Ext.data.Store', {
            id:                   'galleryThumbs',
            model:                'GayGuideApp.model.GalleryPix',
            autoLoad:             false,
            proxy: {
                type:             'jsonp',
                url:              GayGuideApp.jsonBase+'/ajax/json.albumn.php',
                enablePagingParams:   false,
                timeout:          25000,
                extraParams: {
                    lang:         GayGuideApp.lang
                },
                reader: {
                    type:         'json',
                    rootProperty: 'files'
                }
            },
            listeners: {
                load: this.onDirLoad
            }
        });

        me.query('toolbar')[0].setTitle(
            GayGuideApp.isTablet()
                ? (Ux.locale.Manager.get('gallery.toolbar.album', 'Gallery Album: ') + record.data.dirname)
                : ''
        )
        var statusBar = Ext.Viewport.down('#mainStatusBar');
        statusBar && statusBar.clearAll().setCenter(Ux.locale.Manager.get('gallery.toolbar.album', 'Gallery Album: ') + record.data.dirname);
        //GayGuideApp.ggv.setStatusBar(
        //    Ux.locale.Manager.get('gallery.toolbar.album', 'Gallery Album: ') + record.data.dirname
        //);

        GayGuideApp.store.galleryThumbs.removeAll(false);
        GayGuideApp.store.galleryThumbs.getProxy().setExtraParams({
            dir: record.data.dirname
        });

        /*
         *  initiate the load of the dir
         */
        Ext.Viewport.setMasked(GayGuideApp.ggv.loadMask);
        GayGuideApp.store.galleryThumbs.load();
    },

    /////////////////////////////////////////////////////////////////////

    /**
     * onDirLoad - event handler for reading web directory of image files
     *
     */
    onDirLoad: function(me, records, success) {
        control = GayGuideApp.app.getApplication().getController('EventsController');
        control.log('onDirLoad');

        var carouselItems = [],
            thumbItems = [],
            carousel = GayGuideApp.cards.viewport.down('#galleryCarouselView'),
            thumbPanel = GayGuideApp.cards.viewport.down('#GalleryThumbsContainer');

        if (!success) {
            Ext.Viewport.setMasked(false);
            Ext.Msg.confirm('Gay Guide Vallarta', 'Load of Gallery Info Failed<br />Try Again?', function(value) {
                if (value == 'yes') {
                    Ext.Viewport.setMasked(GayGuideApp.ggv.loadMask);
                    GayGuideApp.store.galleryThumbs.load();
                }
            }, this);
            return;
        }

        GayGuideApp.store.galleryThumbs.each(function(record, index, length) {
            thumbItems.push(GayGuideApp.isTablet()?{
                xtype:  'img',
                mode:   'background',
                src:    'http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src=' +
                        record.data.path.replace('http://www.gayguidevallarta.com','') + record.data.file,
                
                style:  "float: left;  margin: 10px; background-color: #333",
                height: 150,
                width:  150,
                itemId: 'ggv-thumb-' + index
            }:{
                xtype:  'img',
                mode:   'background',
                src:    'http://www.gayguidevallarta.com/img.io/timthumb.php?w=150&h=150&src=' +
                        record.data.path.replace('http://www.gayguidevallarta.com','') + record.data.file,
                
                style:  "float: left; margin: 5px;   background-color: #333",
                height: 150,
                width:  150,
                itemId: 'ggv-thumb-' + index
            });

            carouselItems.push({
                xtype:          'imageviewer',
                style:          'background-color: #333;',                
                imageSrc:       'http://www.gayguidevallarta.com/img.io/timthumb.php?w=1024&h=1024&src=' +
                                record.data.path.replace('http://www.gayguidevallarta.com','') + record.data.file,
                layout:         'fit',
                loadingMessage: Ux.locale.Manager.get("misc.loadLocaleMsg", "Loading ..."),
                errorImage:     'resources/images/NoImage.png'
            });
        });

        carousel.setItems(carouselItems);
        carousel.setActiveItem(0);
        thumbPanel.setItems(thumbItems);
        thumbPanel.setActiveItem(0);

        carousel.getParent().query('toolbar button[iconCls="list"]')[0].hide();
        carousel.getParent().query('toolbar #galleryBack')[0].show();
        Ext.Viewport.setMasked(false);

        carousel.getParent().setActiveItem(thumbPanel);
    },

    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('GalleryController');
        if (this.getDebug())
            console.log(args);
    }
});

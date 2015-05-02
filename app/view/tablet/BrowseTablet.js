/**
 *
 */
Ext.define("GayGuideApp.view.tablet.BrowseTablet", {
    //extend:   "GayGuideApp.view.ContainerLite",
    extend: "Ext.Container",
    xtype:    'browsetablet',

    constructor: function(config) {var me = this; me.callParent([config]); },

    config: {
        id:         'browseCard',
        layout:      'card',
        debug: false,

        items: [{
            docked:         'top',
            xtype:          'statusbar'
        },{ ///////////////////////////////////
            docked:         'top',
            xtype:          'toolbar',
            cls:            'sliderToolbar',
            layout:         { pack: 'center' },

            defaults: {
                xtype:       'button',
                ui:          'ggv'
            },

            items: [{
                iconMask:      true,
                iconCls:       'list',
                name:          'slidebutton',
                ui:           'plain'
            },{
                xtype:         'spacer'
            },{
                xtype:           'segmentedbutton',
                ui:              'ggv',
                allowMultiple:   false,
                allowDepress:    false,

                defaults: {
                    ui:          'ggv',
                    pressed:     false,
                    minWidth:    '60px',
                    enableLocale: true
                },

                items: [{
                    locales:       { text: 'browse.button.overview' },
                    text:          'overview',
                    itemId:        'overviewButton',
                    pressed:       true
                },{
                    locales:       { text: 'browse.button.categories' },
                    text:          'categories',
                    itemId:        'categoriesButton'
                },{
                    locales:       { text: 'browse.button.characteristics' },
                    text:          'characteristics',
                    itemId:        'characteristicsButton'
                },{
                    locales:       { text: 'browse.button.cuisines' },
                    text:          'cuisines',
                    itemId:        'cuisinesButton'
                },{
                    locales:       { text: 'browse.button.nearby' },
                    text:          'nearby',
                    itemId:        'nearbyButton'
                }]

            },{
                xtype:         'spacer'
            },{
                itemId:        'locateButton',
                iconMask:      true,
                iconCls:       'locate1',
                name:          'favsButton',
                ui:            'plain'
            },{
                itemId:        'locateFiller',
                iconMask:      true,
                iconCls:       'locate1',
                ui:            'plain',
                style: 'visibility: hidden'
            }]
        },{ /////////////////////////
            layout:            'hbox',
            id:                'browseHbox',
            xtype:             'container',

            listeners: {

            },
            items: [{
                xtype:         'container',
                id:            'browseLeftSide',
                layout:        'card',
                flex:          2,

                items: [{
                    xtype:     'placesmenu',
                    ui:        'round',
                    id:        'overview',
                    store:     null,
                    onItemDisclosure: true,
                    disableSelection: false,
                    preventSelectionOnDisclose: false,
                    allowDeselect: true,

                    itemTpl: [
                        '<div style="width: 50px; float: left; padding-right: 10px;">',
                         '<tpl if="base64 == null" >',
                          '<img width=50  src="./resources/images/{menuIcon}" style="opacity:0.4;" />',
                         '<tpl else>',
                          '<img width=50 alt="" src="data:image/png;base64,{base64}"  style="opacity:0.4;" />',
                         '</tpl>',
                        '</div>',

                        '<div style="padding-top: 5px; margin-left: 60px;" >',
                         '<div class="name" >{menuName}</div>',
                         '<div class="aux" >{menuAuxText}</div>',
                        '</div>',
                        '<br clear="all" />'
                    ],

                    listeners: {
                        initialize: function(me) {
                            me.addListener('selectionchange',
                                Ext.Function.createBuffered(
                                    Ext.ComponentQuery.query('browsetablet')[0].menuSelectionChange, 10, this
                                )
                            );
                        },

                        deselect: function(list, record, supressed, eOpts) {
                            if (supressed) return true;
                            list.up('browsetablet').clearRightSide();
                            return false;
                        }
                    }
                },{
                    xtype: 'catlist',
                    ui:    'round',
                    id:    'catListSimple',
                    preventSelectionOnDisclose: true,

                    itemTpl: [
                        '<tpl if="!catpage || catcode == catpage">',
                             '<div style="font-weight: 700; color: #333">',
                        '<tpl else>',
                             '<div style="font-size: 90%; padding-left: 12px;">',
                        '</tpl>',
                            '{[ Ext.util.Format.ellipsis(values.catname, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8))  ]}',
                            '<tpl if="catpage && catcode != catpage">',
                                '<span style="color: #aaa; font-size: 80%; font-style: italic;">',
                                    ' {catcount}',
                                '</span>',
                            '</tpl> ',
                        '</div>'
                     ],

                    listeners: {
                        initialize: function(me) {
                            me.addListener('selectionchange',
                                Ext.Function.createBuffered(
                                    Ext.ComponentQuery.query('browsetablet')[0].catSelectionChange, 10, this
                                )
                            );
                        },

                        deselect: function(list, record, supressed, eOpts) {
                            if (!supressed)
                                list.up('browsetablet').clearRightSide();
                            return supressed;
                        },

                        disclose: function(list, record){
                            list.select(record);
                        }
                    }
                },{

                    xtype:  'taglist',
                    id:     'tagListSimple',
                    store:   null,
                    //mode:   'MULTI',
                    mode: 'MULTI',
                    cls:    'ggv-clist',
                    ui:     'round',
                    layout: 'fit',
                    disableSelection: false,
                    preventSelectionOnDisclose: true,

                    listeners: {
                        initialize: function(me) {
                            me.addListener('selectionchange',
                                Ext.Function.createBuffered(
                                    Ext.ComponentQuery.query('browsetablet')[0].tagSelectionChange, 10, this
                                )
                            );
                        },
                        itemtaphold: function( me, index, target, record, e, eOpts) {
                            me.deselectAll(true);
                        },

                        select: function(list, record) {
                            if (list.getMode() == 'MULTI')
                                list.up('browsetablet').clearRightSide();
                            return false;
                        },

                        deselect: function(list, record, supressed, eOpts) {
                            if (!supressed) {
                                if (list.getSelection().length <= 1)
                                    list.up('browsetablet').clearRightSide();
                            }
                            return supressed;
                        },

                        disclose: function(list, record) {
                            list.select(record);
                        }
                    }
                },
                ///////////////////////////////////////
                {
                    xtype:                 'nearbylist',
                    id:                    'nearbyList',
                    store:                 null,
                    infinite:              true,

                    useSimpleItems:        true,
                    variableHeights:       true,
                    refreshHeightOnUpdate: false,

                    onItemDisclosure:      true,
                    allowDeselect:         true,
                    disableSelection:      false,

                    scrollToTopOnRefresh:  false,
                    scrollable:            true,
                    pinHeaders:            false,
                    grouped :              false,

                    itemHeight:            70,
                    ui:                    'round',
                    mode:                  'MULTI',
                    flex:                  1,

                    listeners: {
                        selectionchange: function(me, records, eOpts) {

                            var card = me.up('browsetablet'),
                                ids = [];

                            if (card.down('markermap')) {

                                // get list of biz ids selected (MULTISELECT)
                                // and show those only on the map
                                //
                                me.getSelection().forEach(function(item, index) {
                                    ids.push(item.data.id);
                                });
                                card.down('markermap').showMarkers('near', ids);
                            }
                        },

                        select: function(me, record, eOpts) {
                            var card = me.up('browsetablet'),
                                id = record.data.id;

                            // clear infowindow if any and anim selected one
                            //
                            try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {}
                            Ext.defer(function() {
                                card.down('markermap') && card.down('markermap').animateMarker(id, google.maps.Animation.BOUNCE, 800);
                            }, 100, this);
                        }
                    }
                }]
            },{

                xtype:               'container',
                id:                  'browseRightSide',
                layout:              'card',
                flex:                3,
                autoDestroy:         false,
                
                //listeners: {
                //    activeitemchange: function (me, newitem, olditem) {
                //        var i =  (newitem === 0) ? i : newitem.getItemId();
                //        console.log('activeitemchange', i)
                //    }
                //},

                items: [{
                    xtype:           'component',
                    itemId:          'blank',
                    html:            '',
                    layout:          'fit'
                },{
                    xtype:           'plist',
                    itemId:          'ungroupedPlist',
                    store:           null,
                    cls:             'ggv-plist',
                    ui:              'round',
                    variableHeights: true,

                    itemTpl: [

                        '<div class="ggv-tl-star">',
                        '<tpl if="fav">',
                        '<img src="http://www.gayguidevallarta.com/images/star.png" />',
                        '</tpl>',
                        '</div>',

                        '<div class="ggv-list-name">',
                        ' {[ Ext.util.Format.ellipsis(values.list_name, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8)) ]}',
                        '</div>',

                        '<div class="ggv-category-name" style="color: black">',
                        ' {[  Ext.util.Format.ellipsis(values.list_cat_name, 40) ]}',
                        '</div>',

                        '<div class="ggv-category-name" style="padding-left: 30px;">',
                        ' {list_tags}',
                        '</div>'
                    ]
                },{
                    xtype:           'plist',
                    itemId:          'groupedPlist',
                    grouped:         true,
                    store:           null,
                    cls:             'ggv-plist',
                    ui:              'round',
                    variableHeights: true,

                    itemTpl: [

                        '<div class="ggv-tl-star">',
                        '<tpl if="fav">',
                        '<img src="http://www.gayguidevallarta.com/images/star.png" />',
                        '</tpl>',
                        '</div>',

                        '<div class="ggv-list-name">',
                        ' {[ Ext.util.Format.ellipsis(values.list_name, 28 - Math.floor((GayGuideApp.txtSz-20 )*1.8)) ]}',
                        '</div>',

                        '<div class="ggv-category-name" style="color: black">',
                        ' {[  Ext.util.Format.ellipsis(values.list_cat_name, 40) ]}',
                        '</div>',

                        '<div class="ggv-category-name" style="padding-left: 30px;">',
                        ' {list_tags}',
                        '</div>'
                    ]
                },{
                    xtype:           'component',
                    itemId:          'noneFound',
                    layout:          'fit',
                    html:            [
                        '<div style="width: 100%; height: 210px">',
                          '<div style="width: 100%; text-align: center; height: 100%; padding: 50px 10px  50px 10px; font-size: 200%;  border: 1px solid #ccc; color: gray; border-radius: 5px">',
                              'nothing with that <br />combination!',
                          '</div>',
                        '</div>'
                        ].join(''),
                    styleHtmlContent: true
                },{
                    xtype:  'cachemap',
                    itemId: 'nearMap',
                    layout: 'fit',
                    style:  'margin: 15px; border: 1px solid #bbb;',
                    cls:    'ggv-map-google noSliderToolbar',
                    trackLoc:      false,
                    cacheLocation: true,
                    cacheDisplayMarkers: false,

                    //clearMarkerOnActivate: true,

                    listeners: {
                        activate: function(item, me, olditem) {
                            //console.log('browseNearMap.activate');
                            Ext.defer(function() { this.up('browsetablet').refreshNearby(true); }, 1000, this);
                        }
                    }
                }]
            }]
        }]
    },

    /**
     *
     *
     */
    refreshNearby: function(force) {
        //this.log('refreshNearby', force);
        var me = this;
        var a = false;
        if (!me.getItems() || !me.getItems().length) {
            return;
        }

        var map = me.down('markermap'),
            list = me.down('nearbylist'),
            store = list.getStore(),
            y ,
            ids = [];

        if (!map || !list || !store) return;

        y = me.setNearbyPosition(GayGuideApp.ggv.gpsPosition, force);

        if (!this.markersLoaded || y) { // recreate markers needed?
            map.destroyMarkerGroup('near');
            GayGuideApp.ggv.doLoadMarkers(map, store, 15, 'near');
            this.markersLoaded = true;
        }
        try { GayGuideApp.cards.MarkerMap.infowindow.close(); } catch(err) {}
        if (list.getSelection().length) {
            map.showMarkers(['near'], Ext.Array.pluck(Ext.Array.pluck(list.getSelection(), 'data'), 'id'));
        }
        else {
            map.showMarkers(['near']);
        }
        map.setBoundingBox(['near']);
    },

    /**
     *
     *
     *
     *
     * @private
     * @param position
     * @param force
     *
     */
    setNearbyPosition: function(position, force) {
        var map = this.down('markermap'),
            list = this.down('nearbylist'),
            store = list.getStore(),
            i = 15,
            ids = [];

        if (!store || (this.currentPosition && this.currentPosition.equals(position) && !force ))  {
            return false;
        }

        this.currentPosition = position;  // save position so we avoid needless refiltering

        if (store.isFiltered()) store.clearFilter(true);
        store.filterBy(function(record, id) {;
            return !!record.get('list_latitude');
        }, this );
        store.sort();

        var y = store.getRange(i,i); // find the last item in the list we want

        //////////////////////////////
        //
        // filter out everything farther away than the 15th item in the distance sorted list
        //
        if (GayGuideApp.ggv.gpsPosition && y.length && y[0]) {

            var c = new google.maps.LatLng(y[0].data.list_latitude, y[0].data.list_longitude),
                psn = GayGuideApp.ggv.gpsPosition,
                max = google.maps.geometry.spherical.computeDistanceBetween(c, psn);

            if (store.getFilters().length)
                store.clearFilter(true);

            list.getStore().filterBy(function(item) {
                var a = GayGuideApp.ggv.gpsPosition,
                    b = new google.maps.LatLng(item.data.list_latitude, item.data.list_longitude);

                if (!item.data.list_latitude || !item.data.list_longitude) {
                    return false;
                }
                return ( google.maps.geometry.spherical.computeDistanceBetween(psn, b) < max );
            });

        }
        ///////////////////////////////
        return true;
    },

    /**
     *
     *
     *
     *
     *
     *
     */
    clearRightSide: function() {
        var view = this,
            rs =  view.down('#browseRightSide'),
            nav = GayGuideApp.cards.viewport;

        view.onActivate && !view.isActivated() && view.onActivate(view);

        // fade out (to blank container)
        //
        if (!rs._clearPending) {
            rs._clearPending = true;
            rs._ggv_deselectpending = true;
            rs.animateActiveItem(0, {
                type: 'fade',
                duration: 200
            });
            Ext.defer(function() {
                rs._ggv_deselectpending = false;
                rs._clearPending=false;
            }, 201, this);

            nav.afterActionCloseRequested();
        }
    },

    /**
     *
     *
     *
     *
     *
     *
     */
    showButtonActive: function(button) {
        var segbutton = this.down('toolbar segmentedbutton');
        segbutton.getInnerItems().forEach(function(item, index) {
            if (item == button) {
                segbutton.setPressedButtons([button]);
            }
        });
    },

    /**
     *
     *
     *
     *
     *
     *
     */
    scrollToTop: function(arg) {
        var me = this;
            ls = me.down('#browseLeftSide');

        me.onActivate && !me.isActivated() && me.onActivate(me);
        me.query('list').forEach(function(item) {
            var a = item, r;

            if (a && a.onActivate && a.isActivated()) {
                if (a.getStore()) {
                    a.deselectAll(true);
                    a.scrollToTop && a.scrollToTop(a);
                }
            }
        });
    },

    /**
     *
     *
     *
     *
     * @private
     *
     *
     */
    tagSelectionChange: function(me, records) {
        var codes = [],
            view = me.up('browsetablet'),
            plist = view.down('#groupedPlist'),
            rs = view.down('#browseRightSide'),
            plistStore = plist.getStore(); //GayGuideApp.store.pList;

        me.getSelection().forEach(function(item,index) {
            codes.push(item.data.codekey);
        });

        plist.scrollToTop(plist);
        if (!codes.length) return; // nothing selected

        Ext.defer(function() {
            if (codes.length > 0) {
                plistStore.clearFilter(true);
                plist.deselectAll();
                plistStore.filter([{
                    filterFn: function(item) {
                        if (!item.data.list_tagcodes) return false;

                        var t = item.data.list_tagcodes.split('|');
                        for (var i=0; i < codes.length; i++)
                            if (t.indexOf(codes[i]) == -1)
                                return false;
                        return true;
                    }
                }]);

                if (plistStore.getCount()) {

                    if (view.restoreInProgress) {
                        rs.setActiveItem(2);
                    }
                    else {
                        rs.animateActiveItem(2, {
                            type: 'slide',
                            direction: 'right',
                            duration:  300
                        });
                    }
                    plist.refresh();
                }
                else {
                    rs.animateActiveItem(3, {
                        type:      'slide',
                        direction: 'right',
                        duration:  300
                    });
                }
            }
            else {
                rs._ggv_deselectpending = false;
                return;
            }

        // set defer to delay more if clearRightSide was invoked
        //
        }, (rs._ggv_deselectpending && !view.restoreInProgress) ? 190: 1, this);
    },

    /**
     *
     *
     *
     * @private
     *
     *
     */
    catSelectionChange: function(me, records) {
        var view = GayGuideApp.cards.browseCard;
        var r = records[0];
        var grouped = r && (r.data.catcode == r.data.catpage);

        view.onActivate && !view.isActivated() && view.onActivate(view);

        var codes = [],
            plist = view.down(grouped?'#groupedPlist': '#ungroupedPlist'),
            rs = view.down('#browseRightSide'),
            plistStore = plist.getStore();

        me.getSelection().forEach(function(item,index) {
            codes.push(item.data.catcode);
        });

        plist && plist.scrollToTop(plist);

        // potentially wait for clearRightSide to be done
        //
        Ext.defer(function() {
            plist.deselectAll();
            if (codes.length > 0) {
                if (!rs._ggv_deselectpending) {

                    if (view.restoreInProgress) {
                        rs.setActiveItem(grouped?2:1);
                    }
                    else {
                        rs.animateActiveItem(grouped?2:1, {
                            type: 'slide',
                            direction: 'right',
                            duration:  300
                        });
                    }
                }
            }
            else {
                rs._ggv_deselectpending = false;
                return;
            }

            plistStore.clearFilter(true);
            plistStore.filter([{
                filterFn: function(item) {
                    for (var i=0; i < codes.length; i++)
                        if (codes[i] == item.data.list_cat || codes[i] == item.data.list_cat_page)
                            return true;
                    return false;
                }
            }]);

            rs._ggv_deselectpending = false;
            plist.refresh();

        // set defer to delay more if clearRightSide was invoked
        //
        }, (rs._ggv_deselectpending && !view.restoreInProgress) ? 190: 1, this);  // Ext.defer()
        rs._ggv_deselectpending = false;

    },

    /**
     *
     *
     *
     *
     * @private
     *
     */
    menuSelectionChange:  function(me, records) {
        var codes = [],
            view = me.up('browsetablet'),
            plist = view.down('#groupedPlist'),
            rs = view.down('#browseRightSide'),
            plistStore = plist.getStore();   //GayGuideApp.store.pList;

        me.getSelection().forEach(function(item,index) {
            codes.push(item.data.assocListSelect);
        });

        plist.scrollToTop(plist);
        if (!codes.length) return;

        Ext.defer(function() {
            if (codes.length == 0) {
                rs._ggv_deselectpending = false;
                return;
            }
            else{
                if (!rs._ggv_deselectpending) {
                    if (view.restoreInProgress) {
                        rs.setActiveItem(2);
                    }
                    else {
                        rs.animateActiveItem(2, {
                            type: 'slide',
                            direction: 'right',
                            duration:  300
                        });
                    }
                }
            }
            plist.deselectAll();
            plistStore.clearFilter(true);
            plistStore.filter([{
                property: 'list_cat_page',
                value: codes[0]
            }]);
            plist.refresh();
            
            this.up('browsetablet').logListInfo(plist);

        // set defer to delay more if clearRightSide was invoked
        //
        }, (rs._ggv_deselectpending && !view.restoreInProgress) ? 190: 1, this);  // Ext.defer()
        rs._ggv_deselectpending = false;
    },
    
    logListInfo: function(list, tag) {        
        var x = list.getItemMap();
        var y = x.map.length;
        var z = x.map[x.map.length-1];
        //var m = list.
        //console.log('logListInfo', tag, list.getId(), 'INDEX MAX', y, 'LAST OFFSET', z);
    },
    

    saveState: function() {
        var me = this,
            left = me.down('#browseLeftSide'),
            right = me.down('#browseRightSide'),
            leftActive = left && left.getActiveItem(),
            rightActive = right && right.getActiveItem();

        var leftScrollPosition  = leftActive
                                && leftActive.getScrollable
                                && leftActive.getScrollable()
                                && leftActive.getScrollable().getScroller().position.y;
        var rightScrollPosition = rightActive
                                && rightActive.getScrollable
                                && rightActive.getScrollable()
                                && rightActive.getScrollable().getScroller().position.y;
        var leftActiveItemId = leftActive
                                && leftActive.getItemId();
        var rightActiveItemId = rightActive
                                && rightActive.getItemId();
        var leftSelectIndices  = [];
        var rightSelectIndices = [];
            var rightItemOffset = null;
        var leftSelectRecords = leftActive.getSelection();

        if (leftActive.getSelection) {
            leftActive.getSelection().forEach(function(item, index) {
                leftSelectIndices.push(leftActive.getStore().indexOf(item));
            });
        }

        if (rightActive.getSelection) {
            rightActive.getSelection().forEach(function(item, index) {
                rightSelectIndices.push(rightActive.getStore().indexOf(item));
            });
        
            rightActive.refreshScroller && rightActive.refreshScroller();
            rightItemOffset = rightActive.getItemMap().map[rightSelectIndices[0]];
            this.logListInfo(rightActive, 'as saved selected index'+rightSelectIndices[0]);
        }
        var state = {
            leftScrollPosition:  leftScrollPosition,
            rightScrollPosition: rightScrollPosition,
            leftActiveItemId:    leftActiveItemId,
            rightActiveItemId:   rightActiveItemId,
            leftSelectIndices:   leftSelectIndices,
            rightSelectIndices:  rightSelectIndices,
            rightItemOffset:     rightItemOffset
        };
        //console.log('saveState', 'state', state);
        
        return state;
    },

    restoreState: function (a) {
        var state = a,
            me = this,
            left = me.down('#browseLeftSide'),
            leftActive = left && left.getActiveItem();

        this.restoreInProgress = true;
   
        // restore left side
        //
        leftActive.getScrollable().getScroller().scrollTo(0, state.leftScrollPosition);

        var selection = [];
        state.leftSelectIndices.forEach(function(item) {
            var store = leftActive.getStore();
            var record =    store && store.getRange(item,item)[0];

            if (record)
                selection.push(record);
        });
        leftActive.select(selection);

        // restore right side
        //
        var me = this,
            right = me.down('#browseRightSide'),
            rightActive = right && right.getActiveItem();
            
        if (rightActive.getItemId() != state.rightActiveItemId) {
            right.onAfter('activeitemchange', function() {
                this.deferredRestoreRight(state);
            }, this, { single: true, delay: 10 });
        }
        else {
            this.deferredRestoreRight(state);
        }
    },

    deferredRestoreRight: function(state) {
        var me = this,
            right = me.down('#browseRightSide'),
            rightActive = right && right.getActiveItem();
            
        this.log('restoreState','defered', right, rightActive.getItemId());

        // nearMap is not a list, so skip the list restore stuff
        //
        if (rightActive.getItemId() != 'nearMap') {
            var index = state.rightSelectIndices[0];

            if (index > -1 && rightActive.getItemAt) {
                var store = rightActive.getStore();
                var record =    store && store.getRange(index,index)[0];
                if (record && rightActive.select) {
                    rightActive.select(record, false, true);
                }
                rightActive.scrollToIndex(index);
            }
        }
        me.restoreInProgress = false;
    },

    log: function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('BrowseTablet');
        if (this.getDebug())
            console.log(args);
    }
});

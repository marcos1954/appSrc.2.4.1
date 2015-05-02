/**
 *  {@link Ext.ux.slidenavigation.View} is a subclass of {@link Ext.Container}
 *  that provides a sliding main view with an underlying navigation list.  The
 *  concept was inspired by Facebook's mobile app.
 *
 *  modified heavily by Mark Page based on 28nov12 github
 *
 *  @author Weston Nielson <wnielson@github>
 */
Ext.define('Ux.slidenavigation.View', {
    extend: 'Ext.Container',

    requires: [
        'Ext.Button',
        'Ext.Container',
        'Ext.Function',
        'Ext.data.ModelManager',
        'Ext.Toolbar',
        'Ext.data.Model',
        'Ext.data.Store',
        'Ext.dataview.List'
    ],

    xtype: 'slidenavigationview',

    config: {
        /**
         * @cfg {Object} list Configuration for the navigation list
         */
        list: {
            width:         250,
            maxDrag:       null,
            itemTpl:       '{title}',
            allowDeselect: true,
            layout:        'auto',
            grouped:       true,
            items: [{
                xtype:     'toolbar',
                docked:    'top',
                ui:        'light'
            }]
        },

        /**
         * @cfg {Object} container Configuration for the container
         */
        container: {},

        /**
         * @cfg {Array} items An array of items to put into the navigation list.
         * The items can either be Ext components or special objects with a "handler"
         * key, which should be a function to execute when selected.  Additionally, you
         * can define the order of the items by defining an 'order' parameter.
         */
        items: [],

        /**
         * @cfg {Object} groups Mapping of group name to order.  For example,
         * say you have defined two groups; "Group 1" and "Group 2".  By default
         * these will be presented in the list in that order, since
         * 'Group 1' > 'Group 2'.  This option allows you to change the ordering,
         * like so:
         *
         *  groups: {
         *    'Group 1': 2
         *    'Group 2': 1
         *  }
         *
         *  You should use integers, starting with 1, as the ordering value.
         *  By default groups are ordered by their name.
         */
        groups: {},

        /**
         * @cfg {Object} defaults An object of default values to apply to any Ext
         * components created from those listed in ``items``.
         */
        defaults: {
            layout: 'card'
        },

        /**
         * @cfg {String} slideSelector Class selector of object (or parent)
         * of which dragging should be allowed.  Defaults to the entire container.
         * For example, this could be set to something like 'x-toolbar' to restrict
         * dragging only to a toolbar.
         */
        slideSelector: '',

        /**
         * @cfg {Integer} slideDuration Number of miliseconds to animate the sliding
         * of the container when "flicked".  By default the animation is disable on
         * Android.
         */
        slideDuration: Ext.os.is.Android ? 0 : 100,

        /**
         * @cfg {Integer} selectSlideDuration Number of miliseconds to animate the sliding
         * of the container when list item is selected (if closeOnSelect = true). The default
         * value here of 300 gives a much nicer feel.  By default the animation is disable on
         * Android.
         */
        selectSlideDuration: Ext.os.is.Android ? 0 : 100,

        /**
         * @cfg {Boolean} closeOnSelect Whether or not to automatically close the container
         * when an item in the list is selected.  Default is true.
         */
        closeOnSelect: true
    },

    initConfig: function() {
        var me = this;

        me._indexCount = 0;

        /**
         *  Create the store.
         */
        me.store = Ext.create('Ext.data.Store', {
            model: me.getModel(),
            sorters: 'order',
            grouper: {
                property: 'group',
                sortProperty: 'groupOrder'
            }
        });

        /**
         *  Add the items into the list.
         */
        me.addItems(me.config.items || []);
        delete me.config.items;

        me.callParent(arguments);

        /**
         *  This stores the instances of the components created.
         *  TODO: Support 'autoDestroy'.
         *  @private
         */
        me._cache = [];

        /**
         *  Default config values used for creating a slideButton.
         */
        me.slideButtonDefaults = {
            xtype: 'button',
            iconMask: true,
            iconCls: 'list',
            name: 'slidebutton',
            listeners: {
                release: me.toggleContainer,
                scope: me
            }
        };
    },

    initialize: function() {
        this.callParent();

        this.addCls('x-slidenavigation');

        this.list = this.createNavigationList();
        this.container = this.createContainer();

        this.add([
            this.list,
            this.container
        ]);

        // TODO: Make this optional, perhaps by defining
        // "selected: true" in the items list
        this.list.select(0);
    },

    /**
     *  Adds an array of items (or a single item) into the list.
     */
    addItems: function(items) {
        var me = this,
            items1 = Ext.isArray(items) ? items : [items],
            groups = me.config.groups;

        Ext.each(items1, function(item, index) {
            if (!Ext.isDefined(item.index)) {
                item.index = me._indexCount;
                me._indexCount++;
            }
            me.store.add(item);
        });
    },

    /**
     *  update navlist with current translations as needed
     *
     *  translations keys are in config items[] as
     *
     *        items: [{
     *              enableLocale: true,
     *              group: 'groupname',   // used to create and id groups
     *              groupKey: locale.lookup.string  // reference to contents of locale json file
     *              title:  'title'
     *              titleKey: locale.lookup.string  // reference to contents of locale json file
     *         }]
     *
     *  @param {String} locale The language identifier string e.g. "en", "es" or "fr"
     */
    setLocale : function(locale) {
        var me = this;

        me.store.each(function(record, index, length){
            record.set('title', Ux.locale.Manager.get(record.data.titleKey, record.data.title));
            record.set('group', Ux.locale.Manager.get(record.data.groupKey, record.data.group));
        }, me);
        me.list.refresh();
    },

    /**
     *  Creates a button that can toggle the navigation menu.  For an example
     *  config, see ``slideButtonDefaults``.
     */
    createSlideButton: function(el, config) {
        var me = this,
            parent = el.down(config.selector);

        if (parent) {
            return parent.add(Ext.merge(me.slideButtonDefaults, config));
        }

        return false;
    },

    /**
     * Called when an item in the list is tapped.
     */
    onSelect: function(list, item, eOpts) {
        var me = this,
            store = list.getStore(),
            index = item.raw.index,
            container = me.container;
			
		if ( me._cache[index] == undefined) {
			if (Ext.isFunction(item.raw.handler)) {
				me._cache[index] = item.raw.handler;
			}
			else {
				me._cache[index] = container.add(Ext.merge({}, me.config.defaults, item.raw));
				if (item.raw.slideButton) {
					me.createSlideButton(me._cache[index], item.raw.slideButton);
				}
			}
		}
		//console.log('>>>>>>> NAV MENU SELECTED ' + item.data.name + '<<<<<<<<<<<<<<<<');
			
		Ext.defer(function() {
        
            if (this.isClosed()) {
               
                if (Ext.isFunction(this._cache[index])) {
                    this._cache[index](this, container, Ext.merge({}, me.config.defaults, item.raw));
                }
                else {
                    container.setActiveItem(this._cache[index],{
                        type: 'fade',
                        duration: 250
                    });
                }
            }
            else {
                this.addListener('closed', function() {
                    console.log('>>>>>> listener closed fired');
                    if (Ext.isFunction(this._cache[index])) {
                        this._cache[index](this, container, Ext.merge({}, me.config.defaults, item.raw));
                    }
                    else {
                        container.setActiveItem(this._cache[index],{
                            type: 'fade',
                            duration: 250
                        });
                    }
                }, this, {single: true, delay: 100 });
            }

		}, this.config.selectSlideDuration+100, this);
       
		
        if (this.config.closeOnSelect) {            
            this.closeContainer(this.config.selectSlideDuration);
        }
    },

    afterActionCloseRequested: function(me) {
        if (me && !me.isClosed()) {
            Ext.defer(function() {
                    this.closeContainer(this.config.selectSlideDuration);
            }, 400, me);
        }
    },

    onContainerDrag: function(draggable, e, offset, eOpts) {
        var c = draggable.getConstraint(),
            threshold = 30;

        if (c.max.x && offset < threshold) {
            draggable.setConstraint({max: {x:0,y:0}, min: {x:0, y:0}});
        }
        else if (!c.max.x && offset > threshold)  {
            draggable.setConstraint({max: {x:this.config.list.maxDrag,y:0}, min: {x:0, y:0}});
        }

        if (offset.x < threshold && !this.isClosed()) {
            this.setClosed(true);
        }
        else if(offset.x > threshold && this.isClosed()) {
            this.setClosed(false);
        }
    },

    onContainerDragstart: function(draggable, e, offset, eOpts) {
        if (this.config.slideSelector == false) {
            return false;
        }

        if (this.config.slideSelector) {
            var node = e.target;
            while (node = node.parentNode, node) {

                if (node.className && node.className.indexOf('noSliderToolbar') > -1) {
                    return false;
                }

                if (node.className && node.className.indexOf(this.config.slideSelector) > -1) {
                    if (offset < 50)
                        draggable.setConstraint({max: {x:0,y:0}, min: {x:0, y:0}});
                    return true;
                }
            }
            return false;
        }
        return false;
    },

    onContainerDragend: function(draggable, e, eOpts) {
        var velocity  = Math.abs(e.deltaX / e.deltaTime),
            direction = (e.deltaX > 0) ? "right" : "left",
            offset    = Ext.clone(draggable.offset),
            threshold = parseInt(this.config.list.width * .60);

        switch (direction) {
            case "right":
                offset.x = (velocity > 0.75 || offset.x > threshold) ? this.config.list.width : 0;
                break;
            case "left":
                offset.x = (velocity > 0.75 || offset.x < threshold) ? 0 : this.config.list.width;
                break;
        }

        this.moveContainer(offset.x);
    },

    /**
     * Registers the model with Ext.ModelManager, if it hasn't been
     * already, and returns the name of the model for use in the store.
     */
    getModel: function() {
        var model = 'SlideNavigationPanelItem',
            groups = this.config.groups;

        if (!Ext.ModelManager.get(model)) {
            Ext.define(model, {
                extend: 'Ext.data.Model',
                config: {
                    idProperty: 'index',
                    fields: [
                        'index', 'title', 'name', 'group', 'titleKey', 'groupKey',
                        {
                            name: 'order',
                            defaultValue: 1
                        },{
                            name: 'groupOrder',
                            convert: function(value, record) {
                                // By default we group and order by group name.
                                var group = record.get('group');
                                return groups[group] || group;
                            }
                        }
                    ]
                }
            });
        }
        return model;
    },

    /**
     *  Closes the container.  See ``moveContainer`` for more details.
     */
    closeContainer: function(duration) {
        var duration1 = duration || this.config.slideDuration;
        this.moveContainer(0, duration1);
    },

    /**
     *  Opens the container.  See ``moveContainer`` for more details.
     */
    openContainer: function(duration) {
        //console.log('openContainer');
        var duration1 = duration || this.config.slideDuration;
        this.container.addCls('open');
        this.moveContainer(this.config.list.width, duration1);
    },

    toggleContainer: function(duration) {
        //console.log('toggleContainer');
        var duration1 = Ext.isNumber(duration) ? duration : this.config.slideDuration;
        if (this.isClosed()) {
            if (this.container.getDraggable().getConstraint().max.x == 0) {
                this.container.getDraggable().setConstraint({max: {x:this.config.list.maxDrag, y:0}, min: {x:0, y:0}});
            }
            this.openContainer(duration1);
        } else {
            this.closeContainer(duration1);
        }
    },

    /**
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     */
    moveContainer: function(offsetX, duration) {
        var duration1 = duration || this.config.slideDuration,
            draggable = this.container.draggableBehavior.draggable;

        draggable.setOffset(offsetX, 0, {
            duration: duration1
        });
    },

    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     */
    isClosed: function() {
        return (this.container.draggableBehavior.draggable.offset.x == 0);
    },

    /**
     *  Sets the container as being closed.  This shouldn't ever be called
     *  directly as it is automatically called by the ``translatable``
     *  "animationend" event after the container has stopped moving.  All this
     *  really does is set the CSS class for the container.
     */
    setClosed: function(closed) {
        if (closed) {
            var x = this.container.getCls();
            if (x.indexOf('open') == -1) return;

            this.fireEvent('closed', this);
            this.container.removeCls('open');
            this.container.addCls('sliderToolbar');

            if (this.list.down('searchfield')) {
                this.list.down('searchfield').disable();
            }
			this.list.getScrollable().getScroller().scrollTo(0,1);
			this.list.getScrollable().getScroller().scrollTo(0,0);
        }
        else {
            var x = this.container.getCls();
			this.list.down('searchfield').enable();
            if (x.indexOf('open') != -1) return;
			
            this.fireEvent('opened', this);
            this.container.addCls('open');
            this.container.addCls('sliderToolbar');
        }
    },

    /**
     * Generates a new Ext.dataview.List object to be used for displaying
     * the navigation items.
     */
    createNavigationList: function(store) {
        return Ext.create('Ext.dataview.List', Ext.merge({}, this.config.list, {
            store: this.store,
            docked: 'left',
            layout: 'fit',
			infinite: true,
            cls: 'x-slidenavigation-list',
            style: 'position: absolute; top: 0; left: 0; height: 100%;' +
                   'width: 100% !important; z-index: 2',
            listeners: {
                select: this.onSelect,
                scope: this
            }
        }));
    },

    /**
     *  Generates and returns the Ext.Container to be used for displaying
     *  content.  This is the "slideable" container that is positioned above
     *  the navigation list.
     */
    createContainer: function() {
        return Ext.create('Ext.Container', Ext.merge({}, this.config.container, {
            docked: 'left',
            itemId: 'SlidingContainer',
            cls:    'x-slidenavigation-container',
            style:  'width: 100%; height: 100%; position: absolute; opacity: 1; z-index: 5',
            layout: {
                type:      'card',
                animation: {
                    type: 'fade',
                    duration: 350
                }
            },
            draggable: {
                direction: 'horizontal',
                constraint: {
                    min: { x: 0, y: 0 },
                    max: { x: this.config.list.maxDrag || Math.max(screen.width, screen.height), y: 0 }
                },
                listeners: {
                    dragstart: {
                        fn: this.onContainerDragstart,
                        order: 'before',
                        scope: this
                    },
                    drag: Ext.Function.createThrottled(this.onContainerDrag, 100, this),
                    dragend: this.onContainerDragend,
                    scope: this
                },
                translatable: {
                    listeners: {
                        animationend: function(translatable, b, c) {
                            // Remove the class when the animation is finished, but only
                            // if we're "closed"
                            this.setClosed(this.isClosed());
                        },
                        scope: this // The "x-slidenavigation" container
                    }
                }
            }
        }));
    },

    /**
     *  Override the default method so that we actually return the active item in the list,
     *  otherwise this will always return the same thing (the main container, not the
     *  selected item).
     *
     */
    getActiveItem: function() {
        try {
            var selection = this.list.getSelection();
            if (selection) {
                return selection[0];
            }
        } catch(e){}
        return false;
    }
});

/**
 *  List extended to provide DOM stashing when deActivated
 */
Ext.define('GayGuideApp.view.ListLite', {
	extend : 'Ext.List',
	xtype  : 'list-lite',

	config : {
		/**
		 * @cfg {String} title
		 * The title of the card that this tab is bound to.
		 * @accessor
		 */
		title : null,

		/**
		 * Keeps track of the items when deactivated to be readded when activated.
		 * @private
		 */
		optimizedItems : null,

		/**
		 *
		 * @ private
		 */
		currentfilter: null,

		/**
		 *
		 * @ private
		 */
		currentgrouper: null,


		/**
		 *
		 * @ private
		 */
		currentsort: null,



		/**
		 *
		 *
		 *   @accessor
		 */
		scrollerState: 0,


		discloseState:  false


	},

	constructor : function (config) {
		var 	me = this;

		config.optimizedItems = config.items || me.config.items;
		config.items = null;

		me.callParent([config]);
		me.on({
			scope      : me,
			activate   : 'onActivate',
			deactivate : 'onDeactivate'
		});
	},

	onActivate : function (me) {
		var	optItems = me.getOptimizedItems(),
			i=0,
			items = me.getItems(),
			iLen = items.length;

			//if (!optItems)
			//	//console.log(me.getItemId(), '.onActivate() dormant, nothing to restore');
			//else if (Ext.isObject(optItems && optItems[0]) && optItems[0]._itemId)
			//	//console.log(me.getItemId(), '.onActivate() RESTORE STASH '+optItems.length+' Items');
			//else
			//	//console.log(me.getItemId(), '.onActivate() CREATE FROM CONFIG');

		if (!optItems) {
			return false;
		}

		//console.log(me.getItemId(), '.onActivate() adding '+optItems.length+' Items', optItems);
		me.add(optItems);
		me.setOptimizedItems(null);
		me.setScrollerState(null);
		return true;
	},

	onDeactivate : function (me) {
		var items = me.getItems().items,
			i = 0,
			iLen = items.length,
			newItems = [];

			//console.log(me.getItemId(), '.onDeactivate() STASH '+iLen+' ITEMS IN LIST VIEW');

		for (; i < iLen; i++) {
			newItems.push(items[i]);
		}

		if (me.getScrollable())
			me.setScrollerState(me.getScrollable().getScroller().position.y);
		//console.log('scrollState: ',me.getScrollerState());
		me.setOptimizedItems(newItems);
		me.removeAll(false, true);

	},

	scrollTo: function(x,y) {
		var 	me = this;

		//console.log('List-Lite: scrollTo()', x, y);

		return me.getScrollable().getScroller().scrollTo(x, y);
	},

	/**
	 * modified from Ext.data.Store. Reverts to a view of the Record cache with no filtering applied.
	 * @param {Boolean} [suppressEvent=false] `true` to clear silently without firing the `refresh` event.
	 */
	clearFilter: function(suppress) {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: clearFilter()', suppress);


		return store.clearFilter.call(store, suppress);
	},

	getFilters: function() {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: getFilters()', store.getFilters.call(store));

		return store.getFilters.call(store);
	},

	filter: function(a) {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: setFilter()', a);

		me.currentfilter = a;
		store.filter.call(store, me.currentfilter);
	},

	/**
	 * set this list's store's grouper function. setting is cached for getState
	 * on the list
	 *  @param {Object} a grouper config
	 */
	getGrouper: function(a) {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: getGrouper()', a);

		return me.currentgrouper;
	},

	/**
	 * set this list's store's grouper function. setting is cached for getState
	 * on the list
	 *  @param {Object} a grouper config
	 */
	setGrouper: function(a) {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: setGrouper()', a);

		me.currentgrouper = a;
		store.setGrouper.call(store, me.currentgrouper);
	},

	/**
	 * get this list's store's sort from cache state info
	 * on the list
	 *  @param {Object} a
	 */
	getSort: function() {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: getSort() returns:', me.currentsort);

		return me.currentsort;
	},

	/**
	 * set this list's store's sort. setting is cached for getState
	 * on the list
	 *  @param {Object} a
	 */
	sort: function(a,b) {
		var 	me = this,
			store = me.getStore();

			//console.log('List-Lite: sort()', a, b);

		me.currentsort = [a, b];
		store.sort.call(store, a, b);
	},
	
	isActivated: function() {
		var me = this;
		
		if (me.getOptimizedItems()) {
			if (me.getItems().items.length) {
				console.error(me.getItemId(), 'optimized Items AND items!');
			}
			return false;
		}
		return true;
	},
	
	destroy: function(){
		var me = this;
        //console.log('list-lite','destroy', this.getItemId(), !!me.getOptimizedItems());
		me.onActivate(me);
		
		me.un({
			scope      : me,
			activate   : 'onActivate',
			deactivate : 'onDeactivate'
		});
		me.callSuper();
	},
	
	deselectAll: function() {
		//console.log('list-lite','deselectAll', this.getItemId());
		//console.trace();
		this.callSuper();
	}
});

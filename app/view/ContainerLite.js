/**
 * Container Lite - Regular Ext.Container w/inactive items removed
 *   and reinserted automatically when activated
 *
 *  Save DOM space and improves performance
 *
 */
Ext.define('GayGuideApp.view.ContainerLite', {
	extend : 'Ext.Container',
	xtype  : 'container-lite',

	config : {

		//
		// Keeps track of the items when deactivated to be readded when activated.
		//
		optimizedItems : null
	},

	constructor : function (config) {
		var me = this;
		config.optimizedItems = config.items || me.config.items;
		config.items = null;

		me.callParent([config]);

		me.on({
			scope      : me,
			activate   : 'onActivate',
			deactivate : 'onDeactivate'
		});
	},
    
    destroy: function() {
        var me = this;
        me.onActivate(me);
        
        me.un({
			scope      : me,
			activate   : 'onActivate',
			deactivate : 'onDeactivate'
		});
        
        this.callSuper();
    },

	/**
	 * Restores "offline" items to this container if no items offline
	 *  then does nothing
	 *  @param {Ext.ContainerLite} container
	 *
	 */
	onActivate : function (container) {
		var optItems = container.getOptimizedItems(),
			items = container.getItems();

		if (!optItems) {
			return false;
		}

		container.add(optItems);
		container.setOptimizedItems(null);
		console.log(container.getItemId(), 'ACTIVATED');
		return true;
	},

	/**
	 * Saves items "offline" to this container
	 *  then does nothing
	 *  @param {Ext.ContainerLite} container
	 */
	onDeactivate : function (c) {
		var me = this,
			container = c,
			optItems = container.getOptimizedItems(),
			items = container.getItems().items,
			iLen = items.length,
			newItems = [];
			
		for (var i = 0; i < iLen; i++) {
			newItems.push(items[i]);
		}

		if (newItems && !optItems) {
			container.setOptimizedItems(newItems);
			
			Ext.defer(function () {
				me.removeAll(false, true);
			}, 500, container);
		}
	},
	
	isActivated: function() {
		var me = this;
		
		if (me.getOptimizedItems()) {
			return false;
		}
		return true;
	}
});

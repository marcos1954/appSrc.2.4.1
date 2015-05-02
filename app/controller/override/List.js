/**
 *
 */
Ext.define('GayGuideApp.controller.override.List', {
    override : 'Ext.dataview.List',
	
	updateGrouped: function(grouped) {
        var me = this,
            baseCls = this.getBaseCls(),
            pinnedHeader = me.pinnedHeader,
            cls = baseCls + '-grouped',
            unCls = baseCls + '-ungrouped';

        if (pinnedHeader) {
            pinnedHeader.translate(0, -10000);
        }

        if (grouped) {
            me.addCls(cls);
            me.removeCls(unCls);
        }
        else {
            me.addCls(unCls);
            me.removeCls(cls);
        }

        // here's the fix: check if store exists yet
        if (me.getInfinite() && me.getStore()) {
            me.refreshHeaderIndices();
            me.handleItemHeights();
        }
        me.updateAllListItems();
    },
	
	
//    parseEvent: function(e) {
//        var me = this,
//            target = Ext.fly(e.getTarget()).findParent('.' + Ext.baseCSSPrefix + 'list-item', 8),
//			item = target && Ext.getCmp(target.id);
//
//		if (!item)
//			return false;
//		return [me, item, item.$dataIndex, e];
//    },
	
    /**
     * select record with no event fired, despite if selection disabled
     */
    appearSelected: function(record) {
        var list = this,
            x = list.getDisableSelection();
            
        list.setDisableSelection(false);
        list.select(record, false, true);
        list.setDisableSelection(x);
    },

	scrollToIndex: function(index, topOffset) {
		var list = this;
		var scroller = list.getScrollable().getScroller();
		if (list.getInfinite()) {
			
	
			var map = list.getItemMap();
			var offsetTop = map.map[index];
			var centeringOffset = 180;
			
			if (typeof topOffset != 'undefined')
				centeringOffset = topOffset;
			
			if (offsetTop > centeringOffset)
				offsetTop -= centeringOffset;
			else
				offsetTop = 0;
				
			
			var max = scroller.getMaxPosition().y;
			
			var y = offsetTop
			if (y > max) y = max;
			
			scroller.scrollTo(0, offsetTop, false);
			var max = scroller.getMaxPosition().y;
			if (offsetTop > max) offsetTop = max;
			
			scroller.scrollTo(0, offsetTop, false);
		}
		else {
			var a = list.getItemHeight();
			var b = list.getVariableHeights();
			
			if (a > 0 ) {
				scroller.scrollTo(0, index*a, true);
			}
		}
    }
});

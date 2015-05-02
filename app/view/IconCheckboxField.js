/**
 * checkbox field with icons in the label field
 */
Ext.define("GayGuideApp.view.IconCheckboxField", {
	extend: "Ext.field.Checkbox",
	alias: 'widget.iconcheckbox',
	xtype: 'iconcheckbox',
    
    config: {

        /*
         * icon image source url
         *
         */
        labelIcon: null,
        
        /*
         * align icon in label field
         *
         */
        labelIconPosition: 'left'
 
    },
    
    // modified to add icon to label
    // 
    // 
    // @private
    updateLabel: function(newLabel, oldLabel) {
        var nl = newLabel,
            renderElement = this.renderElement,
            prefix = Ext.baseCSSPrefix;

        if (newLabel) {
            if (this.getLabelIcon())
                nl = '<img style="max-width: 44px; height:auto; padding: 0 10px; float: '+this.getLabelIconPosition()+'"  src="'+this.getLabelIcon()+'" > '+newLabel;

            this.labelspan.setHtml(nl);
            renderElement.addCls(prefix + 'field-labeled');
        }
        else {
            renderElement.removeCls(prefix + 'field-labeled');
        }
    }
});
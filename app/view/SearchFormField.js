Ext.define('GayGuideApp.view.SearchFormField', {
    extend: 'Ext.field.Search',
    xtype: 'searchformfield',
 
    getElementConfig: function () {
        var tpl = this.callParent();
 
        tpl.tag = 'form';
        tpl.onsubmit = 'return false;';
 
        return tpl;
    }
});
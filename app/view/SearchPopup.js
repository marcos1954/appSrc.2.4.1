/**
 *
 */
Ext.define("GayGuideApp.view.SearchPopup", {
	extend:         "Ext.Panel",
	requires:       [],
	xtype:          'searchpopup',
    config: {
		id:         'searchPopup',
        width:      250,
		zIndex:     10,
		modal: true,
		hideOnMaskTap: true,
		cls: 'ggv-search-list',

        items: [{
			xtype: 'list',
			infinite: true,
			minHeight: 300,
			itemId:    'searchPopupList',
			disableSelection: false,
			variableHeights: true,
			store:  null,
			
			itemTpl: [
				'{list_name}',
				'<br /><span class="dist">',
				'{list_cat_name}',
				'</span>',
				'<br /><span class="dist">',
				'{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}',
				'</span>'
			]
		}]
	}
});
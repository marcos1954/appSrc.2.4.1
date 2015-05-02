/**
 *
 */
Ext.define("GayGuideApp.view.PlacesInfo", {
	extend: "Ext.Panel",
	alias: "widget.placesinfo",

	config: {
		styleHtmlContent: true,
		layout:           'fit',
		scrollable:       'vertical',
		cls:              'ggv-places-info details',

		tpl: [
			'<div class="detailHdr">',
            
				'<div style="float: left; margin: 0px 10px 0 0; width: 100px;">',
                    '<tpl if="list_src">',
                        '<img class="photo" src="http://www.gayguidevallarta.com{list_src}" width="{list_width}" height="{list_height}" />',
                    '</tpl>',
                '</div>',

				'<div class="infobox" style="margin-left: 110px;">',
					'<h3>{list_name}</h3>',
					'<p  style="word-wrap:break-word; font-size:90%; font-style: italic;">',
					'<tpl if="list_addr1">',
						'{list_addr1}<br/>',
					'</tpl> ',
					'<tpl if="list_addr2">',
						'{list_addr2}<br/>',
					'</tpl> ',
					'<tpl if="list_addr3">',
						'{list_addr3}<br/>',
					'</tpl>' ,
					'<tpl if="list_phone">',
						trans('Phone')+'{list_phone}<br />',
					'</tpl>',
					'{[ GayGuideApp.ggv.dist2LatLng(values.list_latitude, values.list_longitude) ]}</p>',
					'<p style="font-size:80%; color: #655;">{list_tags}</p>',
				'</div>',
			'</div>',

			'<div class="desc">',
				'<tpl if="GayGuideApp.ggv.notes == \'on\' && notes">',
					'<div style="color: #10a; margin-bottom: 30px;  font-family: \'Verdana-Italic\', sans !important;">',
						'{notes}',
						'<br />',
					'</div>',
				'</tpl>',
				'{list_desclong}',
			'</div>'
		]
	}
});

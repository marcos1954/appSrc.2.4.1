/**
 *
 */
Ext.define("GayGuideApp.view.PlacesEvents", {
	extend: "Ext.Panel",
	alias: 'widget.placesevents',

	config: {
		styleHtmlContent: true,
		scrollable:       'vertical',
		layout:           'fit',
		cls:              'ggv-places-events details',

		tpl: [
		'<div class="detailHdr">',
		'<div style="float: left; margin: 0px 10px 0 0;"><img class="photo" src="http://www.gayguidevallarta.com{list_src}" width="{list_width}" height="{list_height}" /></div>',
		'<div class="infobox"  style="margin-left: 110px;">',
		 '<h3>{list_name}</h3>',
		 '<p  style="word-wrap:break-word; font-size:90%; font-style: italic;">',
		 '<tpl if="list_addr1">',  '{list_addr1}<br/>','</tpl> ',
		 '<tpl if="list_addr2">','{list_addr2}<br/>','</tpl> ',
		 '<tpl if="list_addr3">','{list_addr3}<br/>','</tpl>' ,
		 '<tpl if="list_phone">',trans('Phone', 'Ph: ')+'{list_phone}<br />','</tpl>',
		'</div>',
		'</div>',
		
		'<div class="desc">',
		 '<center><span style="font-size: 20px; font-weight: bold;">'+trans('Calendar')+'</span></center>',
		 
		 '<tpl for="eventArray">',
		 
		  '<hr style="color: #bbbbbb; background-color: #bbbbbb; height: 10px;" />',
		  
		  '<tpl if="flyer">',
		   '<div class="ggv-placesevents-flyer">',
		    '<image class="photo" style="width: 300px; height: auto;" src="{flyer}" />',
		   '</div>',
		  '</tpl>',
		  
		  '<div class="ggv-placesevents-item">',
		   '<strong><span style="font-size: 14px;">{category_name}</span><br />',
		   '<span style="font-size: 20px;">{nameEvent}</span><br /></strong>',
		   '@ {locationEvent}<br />',
		   '<br />',
		   '<strong>{timesEvent}</strong><br />',
		   '{event_recurs}<br />',
		   '<br />',
		   '<i>{descEvent}</i><br />',
		   '<br />',
		   '<div class="desc-xxx"  style="clear: none !important;">',
		    '{descEventLong}',
		   '</div>',
		  '</div><br clear="all" />',
		  
		 '</tpl>',
		 
		 '<hr style="color: #bbbbbb; background-color: #bbbbbb; height: 10px;" />',
		'</div>'
		]
	}
});

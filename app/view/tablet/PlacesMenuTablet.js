/**
 *
 */
Ext.define("GayGuideApp.view.tablet.PlacesMenuTablet", {
	extend:   "Ext.Container",
	requires: ['Ext.Img'],
	xtype:    'placesmenutablet',

	config: {

		id: 'placesMenu',
		layout:       'fit',

		items: [{
			docked: 'top',
			xtype:  'statusbar'
		},{
			docked: 'top',
			xtype: 	'titlebar',
			cls:    'sliderToolbar',
			enableLocale: true,
			locales : { title : 'places.menu.title'},
			items: [{
				xtype:   'button',
				iconMask: true,
				iconCls: 'list',
				name:    'slidebutton'
			}]
		},{
			docked:	    'top',
			itemId:     'topImage',
			cls:        'noSliderToolbar',
			xtype:      'container',
			height:     '150px',
			width:      '100%',
			items: [{
				layout:     'fit',
				style:      'height: 150px; padding: 0;',
				html:       '<div style="height:150px; width: 1024px; "  ><img src="resources/images/cover.jpg" /></div>',
				scrollable: { direction: 'horizontal' },
				listeners: {
					painted: function() {
						this.getScrollable().getScroller().scrollTo(0, 0);
					}
				}
			}]
		},{
			docked:      'right',
			itemId:      'rightSideAd',
			xtype:	     'container',
			width:       '260px',
			padding:     '10px 5px 0 5px',
			scrollable:  'vertical',
			listeners: {
				painted: function() {
					this.getScrollable().getScroller().scrollTo(0, 0);
				}
			},
			items: [{
				id:     'ad250x750',
				xtype:  'image',
				width:  '250px',
				height: '750px',
				src:	'./resources/images/CasaCupula250x700v1.png',
				listeners: {
					
					tap: function() {
						//alert('tap casa cupula');
						//Ext.device.Device.openURL('http://www.casacupula.com');
					}
				}
			}]
		},{
			xtype: 'placesmenu',
			ui: 'round',
			itemTpl: [
				'<div style="width: 70px; float: left; padding-right: 10px;">',
				 '<tpl if="base64 == null" >',
				  '<img width=60  src="./resources/images/{menuIcon}" style="opacity:0.4;" />',
				 '<tpl else>',
				  '<img width=60 alt="" src="data:image/png;base64,{base64}"  style="opacity:0.4;" />',
				 '</tpl>',
				'</div>',
			
				'<div style="padding-top: 5px; margin-left: 80px;" >',
				 '<span class="name" >{menuName}</span>',
				 '<br />',
				 '<span class="aux" >{menuAuxText}</span>',
				'</div>',
				'<br clear="all" />'
			]
		}],

		listeners: {
			sizechange: function(me,  width, height) {
				me.adjustSize(me, width, height);
			},

			initialize: function(me) {
				var 	w = Ext.Viewport.getWindowWidth(),
					h = Ext.Viewport.getWindowHeight();

				me.adjustSize(me, w, h);
			}
		}
	},

	adjustSize: function(me, w, h) {
		me.restoreItems(me);

		if (h < GayGuideApp.narrowLimit) {
			me.down('#topImage').hide();
		}
		else {
			me.down('#topImage').show();
		}

		if (w < GayGuideApp.narrowLimit) {
			me.down('#rightSideAd').hide();
		}
		else {
			me.down('#rightSideAd').show();
		}
	},

	restoreItems: function(me) {
		if (me._optimizedItems) me.onActivate(me);
	}
});

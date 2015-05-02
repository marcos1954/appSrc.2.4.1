/**
 *
 */
Ext.define('GayGuideApp.view.GalleryItem', {
	extend: "Ext.Panel",

	xtype: 'galleryitem',

	config: {
		width:  150,
		height: 200,
		style: "overflow: hidden;",
		cls: 'gallery',
		layout: 'vbox',
		items: [{
			xtype: 'img',
			src:   '',
			name:  'pix',
			style:  "background-color: black; "+
					"overflow: hidden;",
			height: 170,
			width: 150
		},
		{
			xtype: 'component',
			styleHtmlContent: true,
			height: 30,
			width: '100%',
			style: 'font-size: .8em;'
		}]
	},

	setSrc: function(src) {
		return this.getComponent(0).setSrc(src);
	},
	getSrc: function() {
		return this.getComponent(0).getSrc();
	},
	setHtml: function(html) {
		return this.getComponent(1).setHtml(html);
	},
	getHtml: function() {
		return this.getComponent(1).getHtml();
	}
});

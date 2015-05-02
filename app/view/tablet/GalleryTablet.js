/**
 *
 */
Ext.define("GayGuideApp.view.tablet.GalleryTablet", {
	extend: "Ext.Container",
	xtype:'gallerytablet',

	requires: [ 'GayGuideApp.view.GalleryItem' ],

	config:  {
		layout:                { type: 'card', animation: { type: 'fade', duration: 100} },
		id:                    'Gallery',
		cls:                   'ggv-gallery',

		items: [{
			docked:        'top',
			xtype:         'statusbar'
		},{
			id:            'GalleryToolbar',
			docked:        'top',
			xtype:         'toolbar',
			enableLocale:   true,
			locales:       { title: 'gallery.toolbar.title' },
			cls:           'sliderToolbar',
			title:         'Gallery',
			items: [{
				itemId:       'menuMore',
				xtype:        'button',
				action:       'menu',
				iconMask:      true,
				ui:           'plain',
				iconCls:      'list',
				name: 	      'slidebutton'
			},{
				itemId:       'galleryBack',
				action:       'back',
				//ui:           'back',
				hidden:        true,
				//enableLocale:  true,
				//locales:      { text: 'nav.button.back' },
				//text:         'Back'
				
				xtype :       'button',
				ui:           'plain',
				//hidden:       true,
				iconCls:      'arrow_left'
			},{
				xtype:'spacer'
			},{
				itemId:       'galleryListing',
				action:       'moreBiz',
				ui:           'ggv',
				enableLocale:  true,
				hidden:        true,
				locales:      { text: 'gallery.toolbar.moreinfo' },
				text:         'more info'
			}]
		},{
			id:             'GalleryInnerContainer',
			xtype:          'container',
			scrollable:     'vertical',
			style:          'margin: auto !important; text-align: center;'
		},{
			id:             'GalleryListGrpContainer',
			xtype:          'container',
			scrollable:     'vertical',
			style:          'margin: auto !important; text-align: center;'
		},{
			id:             'GalleryThumbsContainer',
			xtype:          'container',
			scrollable:     'vertical',
			style:          'margin: auto !important; text-align: center;',
			indicator:      true
		},{
			id:             'galleryCarouselView',
			xtype:          'pinchimagecarousel',
			cls:            'blackback noSliderToolbar',
			layout:         'card',
			indicator:      true
		}]
	}
});

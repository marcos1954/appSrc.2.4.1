/**
 *
 */
Ext.define("GayGuideApp.view.tablet.PlacesPhotoBar", {
	extend: "Ext.Container",
	alias: 'widget.placesphotobar',

	config: {
		cls:         'ggv-places-photobar noSliderToolbar',
		layout:      'fit',
		scrollable:  { direction: 'horizontal' },
		style:       'white-space: nowrap; padding-right: 10px;',
		html:        '',
		maskOnSlide: true,

		listeners: {
			initialize: function() {
				this.maskOnSlide = true;
			}
		}
	}
});

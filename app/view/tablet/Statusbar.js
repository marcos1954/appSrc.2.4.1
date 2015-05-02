/**
 * GayGuideApp.view.tablet.Statusbar
 *   status bar that is top most item in all tablet views
 *
 */
Ext.define("GayGuideApp.view.tablet.Statusbar", {
	extend: "Ext.Container",
	xtype: 'statusbar',

	config: {

		/**
		 * @cfg {string} [cls="sliderToolbar ggv-statusbar"]
		 *
		 */
		cls:    'sliderToolbar ggv-statusbar',

		/**
		 * @cfg {string} [layout=hbox]
		 *
		 */
		layout: 'hbox',


		defaults: {
			xtype: 'component'
		},

		items: [{
			itemId: 'leftStatusBar',
			html: ''
		},
		{ xtype: 'spacer' },
		{
			itemId: 'centerStatusBar',
			html: ''
		},
		{ xtype: 'spacer' },
		{
			itemId: 'rightStatusBar',
			html: '',
			style: 'color: #aaa;'
		}]
	},

	/**
	 * set text status fields into status bar
	 * @param {string} leftMsg The text to be shown on the left side of the status bar
	 * @param {string} centerMsg The text to be shown in the center of the status bar
	 * @param {string} rightMsg The text to be shown on the right side of the status bar
	 */
	setStatus: function(leftMsg, centerMsg, rightMsg) {
		this.down('#leftStatusBar').setHtml(leftMsg);
		this.down('#centerStatusBar').setHtml(centerMsg);
		this.down('#rightStatusBar').setHtml(rightMsg);
	},

	/**
	 * set center text status fields into status bar
	 * @param {string} title The center text on status bar
	 */
	setTitle: function(title) {
		this.down('#centerStatusBar').setHtml(title);
	}
});

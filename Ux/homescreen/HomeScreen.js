/**
 * @author Bruno Tavares
 */
Ext.define('Ux.homescreen.HomeScreen',{
	extend: 'Ext.Component',
	xtype: 'installapp',

	config: {
		cls: Ext.baseCSSPrefix + 'installapp'
	},

	statics: {
		init: function() {

			var dismissed = localStorage.getItem('installapp') === '1';

			if (Ext.browser.is.Standalone || Ext.browser.is('Sencha') || (!Ext.os.is('iOS')) || dismissed) {
				return;
			}

			Ext.Viewport.add({
				xtype: 'installapp',
				hidden: true,
				zIndex: 20
			}).show();
		}
	},

	initialize: function() {
		var	me = this,
			version = Ext.os.version,
			animDir = 'up',
			oldVersion = version.major < 4 || (version.major == 4 && version.minor <= 2);

		if (Ext.os.is('Phone')) {
			me.setBottom(11);
		}
		else {
			me.setTop(11);
			animDir = 'down';
		}

		me.setShowAnimation({
			type: 'slide',
			direction: animDir,
			duration: 750
		});

		me.setHideAnimation({
			type: 'slideOut',
			direction: animDir === 'up' ? 'down' : 'up',
			duration: 750
		});

		me.setHtml(Ext.String.format(
			'Install this web app: tap {0} and then <strong>Add to Home Screen</strong>' +
			'<div class="arrow"></div>',
			oldVersion ? '<span class="icon-plus">+</span>' : '<span class="icon-share"></span>'
		));

		me.callParent(arguments);

		me.element.on('tap', me.onTap, me, {single: true});
		me.onAfter('hide', me.destroy, me, {single: true});

		Ext.defer(me.autoHide, 7000, me);
	},

	onTap: function() {
		localStorage.setItem('installapp', '1');
		this.hide();
	},

	autoHide: function() {
		if (!this.isDestroyed) {
			this.hide();
		}
	}
});

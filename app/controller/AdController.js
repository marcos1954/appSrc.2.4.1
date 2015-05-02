/**
 * GayGuideApp.controller.MainController
 *
 *
 *
 */
Ext.define("GayGuideApp.controller.AdController", {
	extend: "Ext.app.Controller",
	requires: [
		"Ext.util.DelayedTask"
	],

	config: {
		refs: {
			MainNav:        'slidenavigationview',
			Main:           '#MainContainer',
			MainMenu:       '#placesMenu',
			Ad:             'bottomad'
		},
		control: {
			Main: {
				activeitemchange:
				            'onMainNavChange'
			},
			MainNav: {
				closed:     'onClosedMain',
				opened:     'onOpenedMain'
			},
			MainMenu: {
				sizechange: 'onSizeChange'
			},
			Ad: {
				tap:        'onAdTap'
			}
		},

		screen: {},

		store:  null,

		helpTpl: null,

		adDuration: 6000

	},

	/**
	 *
	 *
	 *
	 *
	 */
	launch: function(me) {
		var	app = GayGuideApp;

		me.screen = {w: Ext.Viewport.getWindowWidth(), h: Ext.Viewport.getWindowHeight()};
		//console.log('launch adController');
		app.store = app.store || {};
		app.store.adList = Ext.create('Ext.data.Store', {
			id:                     'adstore',
			model:                  'GayGuideApp.model.Ads',
			autoLoad:               true,
			proxy: {
				type:               'ajax',
				url:                'locale/ads.json',
				reader: {
					type:           'json',
					rootProperty:   'ads'
				},
				timeout:            30000,
				enablePagingParams: false
			}
		});
		app.doAdHide = Ext.create('Ext.util.DelayedTask', function() {
			Ext.Viewport.down('#bottomAd').hide();
		});
	},

	/**
	 * responds to tap of an ad by routing to  #hash
	 *  save when the ad was placed into the ad container
	 *
	 * @param {GayGuideApp.view.BottomAd} me tapped ad container
	 */
	onAdTap: function(me) {
		this.doAdDisplay(0);
		GayGuideApp.cards.eventsList.down('list')._ggv_selected = null;

		if (!me.ggv_route) {
			GayGuideApp.cards.viewport.openContainer(250);
			return;
		}
		me.ggv_route && this.redirectTo(me.ggv_route);
	},

	/**
	 * responds to orientation or size change
	 *
	 */
	onSizeChange: function(me, width, height) {
		me.screen = {w: width, h: height };
		//console.log(GayGuideApp.cards.viewport.container.getActiveItem().getXTypes());
		this.doAdDisplay(this.getAdDuration());
	},

	/**
	 * responds to activeitemchange event on Main Container of the app
	 *  causes new ad to be displayed if one is not already in view
	 *
	 *  avoids putting ads on the placesDetail view
	 *
	 */
	onMainNavChange: function(me, value, oldValue, eOpts) {
		return true;
		//console.log(GayGuideApp.cards.viewport.container.getActiveItem().getXTypes(), GayGuideApp.cards.viewport.container.getActiveItem.xtype);
		if (value == GayGuideApp.cards.placesDetail) {
			this.doAdDisplay(0);
		}
		else if (Ext.Viewport.down('#bottomAd').getHidden()) {
			this.doAdDisplay(this.getAdDuration());
		}
		return true;
	},

	/**
	 * Responds to app's slidemenu closing.  Listening on 'opened' and 'closed' events from slidenavigationview
	 *
	 */
	onClosedMain: function() {
		return true;
		if (GayGuideApp.cards.viewport.container.getActiveItem() != GayGuideApp.cards.placesDetail) {
			this.doAdDisplay(this.getAdDuration());
		}
		else {
			this.doAdDisplay(0);
		}
		return true;
	},

	/**
	 *
	 *
	 *
	 *
	 */
	onOpenedMain: function() {
		this.doAdDisplay(0);
	},

	//
	//
	//

	/**
	 *
	 *
	 *
	 *
	 */
	doAdDisplay: function(time) {
		return;
	
		this.screen = this.screen || {w: Ext.Viewport.getWindowWidth(), h: Ext.Viewport.getWindowHeight()};
		if (this.screen.h < 580) return;
		if (this.chance(.3)) return;
		this.ggv_route = null;
		if (time) {
			this.doNewAd();
			this.getAd().show();
			GayGuideApp.doAdHide.delay(time);
		}
		else {
			GayGuideApp.doAdHide.cancel();
			this.getAd().hide();
		}
	},

	/**
	 * place a random ad into the ad container
	 *
	 * @param {String} type
	 */
	doNewAd: function(type) {
		var ad = this.getAd(),
			hash = window.location.hash.substring(1);

		if (this.helpAd(type, hash)) return;
		//if (this.chance(.5) && this.customAd(type, hash)) return;
		//if (this.chance(.8) && this.eventAd(type, hash)) return;

		//console.log('default Ad!');
		GayGuideApp.helped = false;
		if (this.helpAd(type, hash)) return;
		//
		//ad.addCls('serif');
		//ad.setTpl(null);
		//ad.setHtml('<div style="float: left; width: 80px;" ><img src="http://www.gayguidevallarta.com/Listings/Images/encuentroslogo.gif" width="70" height=auto" /></div><strong>Encuentros</strong> Special tonight is Venetian pizza or pasta. 50 pesos!');
	},


	/**
	 * place a random ad from eventList store into the ad container
	 *
	 * @param {String} type
	 * @paran {String} route hash string
	 * @return {Boolean} success
	 */
	eventAd: function(type, hash) {
		var h = hash.split('/'),
			ad = this.getAd(),
			record,
			filter;

		if (h[0] == 'events') {
			record = this.getStoreRecord(GayGuideApp.store.eventsList, parseInt(h[1]));

			if (record) filter = {
				property: 'business_id',
				value: record.data.business_id
			};
		}

		record = this.getRandomRecord(GayGuideApp.store.eventsList, filter?[filter]:null);

		if (record) {
			ad.ggv_route = 'events/'+record.data.id;
			ad.setTpl([
			'<div style="width: 100%; height: 100%; overflow: hidden;">',

				//
				// event logo
				//
				'<div class="ggv-el-logo">',
				'<img src="http://www.gayguidevallarta.com{logoEventATTRS}" />',
				'</div>',

				//
				// event name, biz name, location
				//
				'<div class="ggv-el-name">',
				' <div class="ggv-event-list-eventname">',
				'{nameEvent}',
				'</div>',
				' <div class="ggv-event-list-name">',
				'{list_name}</div>',
				' <div class="ggv-event-list-cat-name">',
				'{catnameEvent} </div>',
				'</div>',

				'<div style="width: 37px; float: left; padding-top: 5px; padding-right: 5px;">',
					'<tpl if="fav == 1">',
						'<img src="http://www.gayguidevallarta.com/images/star.png" height="35" width="35" />',
					'<tpl else>',
						'&nbsp;',
					'</tpl>',
				'</div>',

				//
				// start time clockface
				//
				'<div class="clock" style="float: left; margin-top: 5px;">',
					'<div class="clockhighlight1">',
						'<div class="clockface">',
							'<tpl if="timesEvent">',
								'<div class="hourhand" style=" -webkit-transform: rotate({[ GayGuideApp.ggv.timeHrRotation(values.startTime)  ]}deg); "  ></div>',
								'<div class="minhand" style="  -webkit-transform: rotate({[ GayGuideApp.ggv.timeMinRotation(values.startTime)  ]}deg); "  ></div>',
							'</tpl> ',
						'</div>',
					'</div>',
					'<tpl if="timesEvent">',
						'<div style="padding-top: 5px;font-size: 0.6em; line-height: 85%;  color: #ddd; font-weight: 300; text-align: center;"> {[ GayGuideApp.ggv.startTimesEvent(values.startTime) ]} </div>',
					'<tpl else>',
						'<div style="padding-top: 5px;font-size: 0.6em; line-height: 85%;  color: #ddd; font-weight: 300; text-align: center;"> all<br />day </div>',
					'</tpl> ',
				'</div>',

				//
				// event description
				//
				'<div class="ggv-el-desc">',
				'{descEvent}',
				'</div>',

			'</div>']);
			ad.setData(record.data);
			ad.addCls('serif');
			return true;
		}
		return false;
	},

	/**
	 * place a random ad from adList store into the ad container
	 *
	 * @param {String} type
	 * @paran {String} route hash string
	 * @return {Boolean} success
	 */
	customAd: function(type, hash) {
		var x,
			record,
			probabilty_remove = .3,
			ad = this.getAd(),
			store = Ext.getStore('mainstore');

		x = this.getRandomRecord(GayGuideApp.store.adList)
		ad.ggv_route = 'places/'+x.data.bizId;
		record = x && this.getStoreRecord(store, x.data.bizId);

		if (record) {
			ad.addCls('serif');
			ad.setTpl(null);
			ad.setHtml('<div style="float: left; width: 80px;" ><img src="http://www.gayguidevallarta.com'+record.data.list_src+'" width="70" height=auto" /></div><strong>'+record.data.list_name+'</strong> '+x.data.adText);
			if (this.chance(probabilty_remove)) store.remove([record]);
			return true;
		}
		return false;
	},

	/**
	 * place a help in an ad container
	 *
	 * @param {String} type
	 * @paran {String} route hash string
	 * @return {Boolean} success
	 */
	helpAd: function(type, hash) {
		var	helptext='The Main Menu can be found by pressing the <span style="font-family: ggvSymbols; font-size: 80%;">&nbsp;!&nbsp;</span> in the upper left corner.',
			ad = this.getAd();

		if (GayGuideApp.helped) return false;

		GayGuideApp.helped = true;

		if (!this.getHelpTpl()) {
			this.setHelpTpl('<div style="padding: .8em;"><div style="float: left; width: 80px; height: 130px;"><strong>Hint:</strong></div> {helptxt}</div>');
		}

		ad.addCls('serif');
		ad.setTpl(this.getHelpTpl());
		ad.setData({ helptxt: helptext });
		ad.ggv_route = null;
		return true;
	},

	/**
	 * returns a record by ID from a store.
	 *
	 * @param {Ext.data.store} store the store to fetch the record from
	 * @param {Number} id the record id (assumes field 'id' on model)
	 * @return {Ext.data.Model} the desired record
	 */
	getStoreRecord: function(store, id) {
		if (!store) return null;

		var y = store.getFilters();

		store.clearFilter();
		var record = store.findRecord('id', id, 0, false, false, true);
		store.setFilters(y);
		return record;
	},

	/**
	 * returns a random record from a given store
	 *
	 * @param {Ext.data.store} store to fetch the random record from
	 * @return {Ext.data.Model} random record
	 */
	getRandomRecord: function(store, filter) {
		if (!store || !store.isLoaded()) return null;

		var x = store.getFilters();

		store.clearFilter(true)
		if (filter) {
			store.filter(filter);
		}
		var y = store.getRange(0);
		var	i = Math.floor( Math.random() * y.length );
		//console.log('random index', i, y.length, store.getId());
		store.clearFilter(true)
		store.setFilters(x);
		return y[i];
	},

	/**
	 * returns true specified percentage of time
	 *
	 * @param {Number} chance probablity  value between 0 and 1
	 * @return {Boolean}
	 */
	chance: function(chance) {
		return Math.random() < chance;
	}
});

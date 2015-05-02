/**
 *
 */
Ext.define("GayGuideApp.view.phone.Main", {
	extend: 'Ux.slidenavigation.View',
	alias : 'widget.phonemainview',

	requires: [
		'Ext.Container',
		'Ext.Panel',
		'Ext.Toolbar',
		'Ext.event.publisher.Dom',
		'Ext.field.Search',
		'Ext.Map',

		'GayGuideApp.view.phone.Settings',
		'GayGuideApp.view.phone.FavsList',
		'GayGuideApp.view.phone.PlacesListPhone',
		'GayGuideApp.view.phone.DetailPhone',
		'GayGuideApp.view.phone.PhoneEventsList',
		'GayGuideApp.view.phone.PhoneEventsDetail'
	],

	config: {
		listeners: {
			initialize: function(me) {
				me.container.addCls('sliderToolbar');
			}
		},

		fullscreen:    false,
		closeOnSelect: true,

		/**
		 *  Any component within the container with an 'sliderToolbar' class
		 *  will be draggable.  To disable draggin all together, set this
		 *  to false.
		 */
		slideSelector: 'sliderToolbar',

		/**
		 *  Time in milliseconds to animate the closing of the container
		 *  after an item has been clicked on in the list.
		 */
		//selectSlideDuration: 200,

		/**
		 *  Configure how the menu list container looks.
		 */
		list: {
			maxDrag: 250,
			width:   200,
			layout:  'auto',

			items: [{
				xtype:  'container',
				docked: 'top',
				cls:    'menuheader',
				style:  'background-size: 100px 55px; background-repeat: no-repeat;background-position: center top;',
				height: 50,
				width:  200
			},{
				xtype:       'formpanel',
				width:       200,
				docked:      'top',
				masked:      false,
				layout:		'fit',
				height:      50,
				
				scrollable: null,
				style:       'margin-top: 0px;',
				items: [{
					xtype:       'searchformfield',
					id:          'searchfield',
					cls:         'ggv',
					autoCapitalize: false,
					autoComplete: false,
					autoCorrect: false,
					disabled:    true,
					labelwidth:  0,
					placeHolder: 'search',
					width:       190
				}]
			}],

			listeners: {
				order: 'before',
				itemtap: function(me, index, target, record) {
					if (me.isSelected(record)) {
						me.deselect(record, true);
						me.select(record, false, false);
						return false;
					}
					return true;
				}
			}
		},

		/**
		 *  Example of how to re-order the groups.
		 */
		groups: {
			'Directory': 3,
			'Pictures':  5,
			'Calendar':  1,
			'Map':       2,
			'Favorites': 4,
			'Settings':  6
		},

		/*
		 * Use Ux.locale ??? for items?
		 */
		enableLocale: true,

		/**
		 *  These are the default values to apply to the items within the
		 *  container.
		 */
		defaults: {
			style:            'background: #fff',
			xtype:            'container-lite'
		},

		container: {
			id:               'MainContainer',
			layout:           'card'			
		},

		items: [{
			title:            'Gay PV Directory',
			name:             'Gay PV Directory',
			group:            'Directory',
			titleKey:         'navlist.title.browselist',
			groupKey:         'navlist.group.directory',
			order:            1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placesmenu', true);
			}
		},{
			title:            'Categories',
			name:             'Categories',
			group:            'Directory',
			titleKey:         'navlist.title.catList',
			groupKey:         'navlist.group.directory',
			order:            1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['catList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placescats', true);
			}
		},{
			title:            'Alphabetized  List',
			name:             'Alphabetized  List',
			group:            'Directory',
			titleKey:         'navlist.title.alphalist',
			groupKey:         'navlist.group.directory',
			order:            1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placeslist/alpha', true);
			}
		},{
			title:            'Full Categorized List',
			name:             'Full Categorized List',
			group:            'Directory',
			titleKey:         'navlist.title.fullcatlist',
			groupKey:         'navlist.group.directory',
			order:            1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placeslist/-', true);
			}
		},{
			title:            'Single Day',
			name:             'Single Day',
			group:            'Calendar',
			titleKey:         'navlist.title.singleday',
			groupKey:         'navlist.group.calendar',
			itemId:           'DayCalendarContainer',
			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('eventslist', true);
			}
		},{
			title:             'Gallery',
			name:              'Gallery',
			group:             'Pictures',
			titleKey:          'navlist.title.gallery',
			groupKey:          'navlist.group.gallery',
			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('gallery', true);
			}
		},{
			title:             'Gay PV Map',
			name:              'Gay PV Map',
			group:             'Map',
			titleKey:          'navlist.title.map',
			groupKey:          'navlist.group.map',
			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('gaypvmap', true);
			}
		},{
			title:             'My Favorites',
			name:              'My Favorites',
			group:             'Favorites',
			titleKey:          'navlist.title.myfavorites',
			groupKey:          'navlist.group.favorites',

			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('favslist', true);
			}
		},{
			title:             'My Notes',
			name:              'My Notes',
			group:             'Favorites',
			titleKey:          'navlist.title.mynotes',
			groupKey:          'navlist.group.favorites',

			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('noteslist', true);
			}
		},{
			title:             'Settings',
			name:              'Settings',
			group:             'Settings',
			titleKey:          'navlist.title.settings',
			groupKey:          'navlist.group.settings',

			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('settings', true);
			}
		}]
	}
});

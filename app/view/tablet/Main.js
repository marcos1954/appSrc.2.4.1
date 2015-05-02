/**
 * GayGuideApp.view.tablet.Main - root view of GayGuideApp on tablet
 *
 *
 *
 *
 *
 *
 *
 */

Ext.define("GayGuideApp.view.tablet.Main", {
	extend: 'Ux.slidenavigation.View',

	requires: [
		'Ext.Container',
		'Ext.Panel',
		'Ext.Toolbar',
		'Ext.event.publisher.Dom',
		'Ext.field.Search',
		'GayGuideApp.view.tablet.Settings',
		'Ext.Map'
	],

	config: {
		listeners: {
			initialize: function(me) {
			    me.container.addCls('sliderToolbar');
			}
		},

		fullscreen: true,
		closeOnSelect: true,

		/**
		 *  Any component within the container with an 'x-toolbar' class
		 *  will be draggable.  To disable draggin all together, set this
		 *  to false.
		 */
		slideSelector: 'sliderToolbar',

		/**
		 *  Time in milliseconds to animate the closing of the container
		 *  after an item has been clicked on in the list.
		 */
		//selectSlideDuration: 100,

		/**
		 *  This allows us to configure how the actual list container
		 *  looks.  Here we've added a custom search field and have
		 *  modified the width.
		 */
		list: {
			maxDrag: 250,
			width: 200,
			items: [{
				xtype:  'container',
				docked: 'top',
				cls:    'menuheader',
				height: 110,
				width:  200
			},{
				xtype:       'formpanel',
				id:          'searchformpanel',
				width:       200,
				docked:      'top',
				masked:      false,
				layout:		'fit',
				height:      50,
				scrollable: null,
				items: [{
					xtype:       'searchformfield',
					id:          'searchfield',
					cls:         'ggv',
					autoCapitalize: false,
					autoComplete: false,
					autoCorrect: false,
					disabled:    true,
					labelwidth:  0,
					placeHolder: trans('search'),
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
			'Directory': 2,
			'Favorites': 4,
			'Calendar':  1,
			'Map':       3,
			'Pictures':  5,
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

		container: {
			id:          'MainContainer',
			layout:      'card'			
		},
		defaults: {
			style: 'background: #fff',
			xtype: 'container-lite'
		},

		items: [
				
		{
			title:       'Gay PV Directory',
			name:        'Gay PV Directory',
			group:       'Directory',
			titleKey:    'navlist.title.placesmenu',
			groupKey:    'navlist.group.directory',
			order:       1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placesmenu', true);
			}
		},{
			title:       'Browse',
			name:        'Browse',
			group:       'Directory',
			titleKey:    'navlist.title.browselist',
			groupKey:    'navlist.group.directory',
			order:       1,
			handler: function(slideNav, target, config) {
				//if (GayGuideApp.cards.browseCard)
				//	GayGuideApp.cards.browseCard._mainnav = true;
				
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['browseCard'] = null;
				GayGuideApp.app.getApplication().redirectTo('overview', true);
			}

			
		//},{
		//	title:       'Categories',
		//	name:        'Categories',
		//	group:       'Directory',
		//	titleKey:    'navlist.title.catList',
		//	groupKey:    'navlist.group.directory',
		//	order:       1,
		//	handler: function(slideNav, target, config) {
		//		if (GayGuideApp.cards.catList) GayGuideApp.cards.catList._mainnav = true;
		//		GayGuideApp.app.getApplication().redirectTo('placesexplore', true);
		//	}
		//},{
		//	title:       'Characteristics',
		//	name:        'Characteristics',
		//	group:       'Directory',
		//	titleKey:    'navlist.title.tagList',
		//	groupKey:    'navlist.group.directory',
		//	order:       1,
		//	handler: function(slideNav, target, config) {
		//		if (GayGuideApp.cards.browseCard) GayGuideApp.cards.browseCard._mainnav = true;
		//		GayGuideApp.app.getApplication().redirectTo('placeschars', true);
		//	}
		//},
		//{
		//	title:       'Cuisines',
		//	name:        'Cuisines',
		//	group:       'Directory',
		//	titleKey:    'navlist.title.cuisineList',
		//	groupKey:    'navlist.group.directory',
		//	order:       1,
		//	handler: function(slideNav, target, config) {
		//		if (GayGuideApp.cards.browseCard) GayGuideApp.cards.browseCard._mainnav = true;
		//		GayGuideApp.app.getApplication().redirectTo('placescuisine', true);
		//	}
		
		},{
			title:       'Alphabetized  List',
			name:        'Alphabetized  List',
			group:       'Directory',
			titleKey:    'navlist.title.alphalist',
			groupKey:    'navlist.group.directory',
			order:       1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placeslist/alpha', true);
			}
		},{
			title:       'Full Categorized List',
			name:       'Full Categorized List',
			group:       'Directory',
			titleKey:    'navlist.title.fullcatlist',
			groupKey:    'navlist.group.directory',
			order:       1,
			handler: function(slideNav, target, config) {
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['placesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('placeslist/-', true);
			}
		},{
			title:       'Single Day',
			name:        'Single Day',
			group:       'Calendar',
			titleKey:    'navlist.title.singleday',
			groupKey:    'navlist.group.calendar',
			itemId:      'DayCalendarContainer',
			handler: function(slideNav, target, config) {
				GayGuideApp.app.getApplication().redirectTo('eventslist', true);
			}
		},{
			title:             'Gallery',
			name:             'Gallery',
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
								
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['favsList'] = null;
				GayGuideApp.app.getApplication().redirectTo('favslist', true);
			}
		},{
			title:             'My Notes',
			name:              'My Notes',
			group:             'Favorites',
			titleKey:          'navlist.title.mynotes',
			groupKey:          'navlist.group.favorites',

			handler: function(slideNav, target, config) {								
				if (GayGuideApp.ggvstate)
					GayGuideApp.ggvstate['notesList'] = null;
				GayGuideApp.app.getApplication().redirectTo('noteslist', true);
			}
		//},{
		//	title:             'Near Me Now',
		//	name:              'Near Me Now',
		//	group:             'Favorites',
		//	titleKey:          'navlist.title.nearby',
		//	groupKey:          'navlist.group.favorites',
		//
		//	handler: function(slideNav, target, config) {
		//		GayGuideApp.app.getApplication().redirectTo('placesnearby');
		//	}
		//},{
		//	title:             'Recently Viewed',
		//	name:              'Recently Viewed',
		//	group:             'Favorites',
		//	titleKey:          'navlist.title.recents',
		//	groupKey:          'navlist.group.favorites',
		//
		//	handler: function(slideNav, target, config) {
		//		GayGuideApp.app.getApplication().redirectTo('recentlist', true);
		//	}
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

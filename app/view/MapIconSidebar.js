/**
 *
 */
Ext.define("GayGuideApp.view.MapIconSidebar", {
	extend: "Ext.Container",

	alias: 'widget.mapiconsidebar',
	xtype: 'mapiconsidebar',
    
    config: {
        listeners: {
            initialize: function(me) {
                me.addCls('nolabels');
            }
        },

        scrollable: {
            direction: 'vertical',
            indicators: false
        },
 
        width:      58,       
        style:      'background: #000; width: 58px; height: 100%; padding: 3px;',
        cls:        'sidebar',        
        defaults: {
            xtype:  'button',
            cls:    'ggvmap',
            style:  'margin: 3px ;',
            enableLocale: true,
            listeners : {
                element : 'element',
                taphold : function() {
                    var btn = this;
                    btn.fireEvent('longtap', btn);
                }
            }
        },
        
        items: [{
            locales: { text: 'mapa.settings.favs' },
            itemId: 'favs',
            icon:  './resources/images/mapicons/star27x33.png'
        },{
			locales: { text: 'mapa.settings.bars' },
            itemId: 'bars',
            icon:   './resources/images/mapicons/marker2-bars.png'
        },{
            locales: { text: 'mapa.settings.restaurants' },
            itemId: 'rest',
            icon:   './resources/images/mapicons/marker2-restaurants.png'
        },{
            locales: { text: 'mapa.settings.cafe' },
            itemId: 'cafe',
            icon:   './resources/images/mapicons/marker-coffee.png'
        },{
            locales: { text: 'mapa.settings.beaches' },
            itemId: 'beach',
            icon:   './resources/images/mapicons/marker2-beaches.png'
        },{
            locales: { text: 'mapa.settings.atms' },
            itemId: 'atm',
            icon:   './resources/images/mapicons/marker-atm.png'
        },{
            locales: { text: 'mapa.settings.shopping' },
            itemId: 'shop',
            icon:   './resources/images/mapicons/marker2-shops.png'
        },{
            locales: { text: 'mapa.settings.gallery' },
            itemId: 'art',
            icon:   './resources/images/mapicons/marker-gallery.png' 
        },{
            locales: { text: 'mapa.settings.tourdesk' },
            itemId: 'desk',
            icon:   './resources/images/mapicons/marker-tourdesk.png'
        },{
            locales: { text: 'mapa.settings.tourdesk' },
            itemId: 'tour',
            icon:   './resources/images/mapicons/marker2-tours.png'
        },{
            locales: { text: 'mapa.settings.gyms' },
            itemId: 'gym',
            icon:   './resources/images/mapicons/marker2-gyms.png'
        },{
            locales: { text: 'mapa.settings.spa' },
            itemId: 'spa',
            icon:   './resources/images/mapicons/marker-spa.png'
        },{
            locales: { text: 'mapa.settings.hotels' },
            itemId: 'hotel',
            icon:   './resources/images/mapicons/marker2-hotels.png'
        },{
            locales: { text: 'mapa.settings.org' },
            itemId: 'org',
            icon:   './resources/images/mapicons/marker2-organizations.png'
        },{
            locales: { text: 'mapa.settings.re' },
            itemId: 're',
            icon:   './resources/images/mapicons/marker-re.png'
        },{
            locales: { text: 'mapa.settings.events' },
            itemId: 'event',
            icon:   './resources/images/mapicons/marker2-events.png'
        },{
            locales: { text: 'mapa.settings.other' },
            itemId: 'other',
            icon:   './resources/images/mapicons/marker-other.png'
        }]
    }
});
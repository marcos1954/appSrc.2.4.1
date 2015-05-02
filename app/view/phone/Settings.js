/**
 *
 */
Ext.define('GayGuideApp.view.phone.Settings', {
    extend: 'Ext.form.FormPanel',
    requires: [
        'Ext.field.Toggle',
        'Ext.field.Radio'
    ],
    xtype:  'settings',
    alias:  'widget.settings',

    config: {
        id:         'settingsCard',
        scrollable: 'vertical',
        xtype:      'form',

        items: [{
            xtype:        'titlebar',
            docked:       'top',
            cls:          'sliderToolbar',
            locales:      { title : 'settings.title' },
            items: [{
                xtype:    'button',
                iconMask: true,
                iconCls:  'list',
                name:     'slidebutton',
                listeners: {
                    tap: function(me) {
                        var x = me.up('slidenavigationview');

                        Ext.callback(x.toggleContainer,x,[],0);
                    }
                }
            }]
        },{
            id:           'textsize',
            xtype:        'fieldset',
            enableLocale: true,
            locales:      { title : 'settings.textsize.title' },
            style:        'font-size: 80%;',
            defaults: {
                width:       '100%',
                labelWidth:  '40%'
            },

            items: [{
                id:           'textsizeslider',
                xtype:        'sliderfield',
                enableLocale: true,
                locales:      { label : 'settings.textsize.fieldlabel' },
                increment:    1,


                listeners: {
                    initialize: function(me) {
                        var x = GayGuideApp.txtSzBase;

                        me.setMaxValue(x+2);
                        me.setMinValue(x-2);
                        me.setValue(GayGuideApp.txtSz || x);
                    },
                    change: function(me, sl, thumb, newValue, oldValue) {
                        changemysize(newValue+"px");
                        GayGuideApp.txtSz = newValue;
                        createCookie('txtSz', newValue, 0, 300);
                    },
                    painted: function() {
                        if (GayGuideApp.txtSz) this.setValue(parseInt(GayGuideApp.txtSz));
                    }
                }
            }]

        },{
            id:           'gpsfieldset',
            xtype:        'fieldset',
            enableLocale: true,
            locales:      { title : 'settings.gps.title' },
            style:        'font-size: 80%;',

            defaults: {
                width:       '100%',
                labelWidth:  '70%'
            },

            items: [{
                id:           'gpsEnabled',
                xtype:        'togglefield',
                enableLocale: true,
                locales:      { label : 'settings.gps.enable' },

                listeners: {
                    painted: function(me, opts){
                        var app = GayGuideApp,
                            ggv = app.ggv;

                        app.cards.viewport.query('#'+me.getId())[0].setValue(ggv.gps != 'off');
                    },

                    change: function (me, slider, thumb, value) {
                        var app = GayGuideApp,
                            ggv = app.ggv;

                        ggv.gps = value?'home':'off';
                        createCookie('gps', ggv.gps, 0, 300);

                        if (value) {
                            ggv.geo.setAutoUpdate(true);
                            try {
                                var v = app.cards.MarkerMap.getMap();
                                //ggv.geoMarker(v);
                                ggv.setGeoMarker(app.cards.placesDetail.query('#detailMap')[0].getMap());
                            } catch(err) {};
                        }
                        else {
                            ggv.geo.setAutoUpdate(false);
                            try {
                                ggv.myMarker.setMap(null);
                                ggv.setGeoMarker(null);
                            } catch(err) {};
                        }
                        if (google && value && !ggv.gpsPosition) {
                            ggv.doGeoUpdate(function(geo){});
                        }
                    }
                }
            },{
                id:           'directionsEnabled',
                xtype:        'togglefield',
                enableLocale: true,
                locales:      { label: 'settings.gps.directions' },

                listeners: {
                    painted: function(me, opts){
                        var app = GayGuideApp,
                            ggv = app.ggv;

                        app.cards.viewport.query('#'+me.getId())[0].setValue(ggv.directions != 'off');
                    },
                    change: function (me, slider, thumb, value) {
                        var app = GayGuideApp,
                            ggv = app.ggv;

                        if (ggv.directionsDisplay) {
                            ggv.directionsDisplay.setMap(null);
                        }
                        ggv.directions = value ? 'on':'off';
                        createCookie('directions', ggv.directions, 0, 300);
                        ggv.geo.setAutoUpdate(false);

                        if (value)  {
                            try { ggv.myMarker.setMap(app.cards.MarkerMap.map); } catch(err) {};
                        }
						else {
                            try { ggv.myMarker.setMap(null); } catch(err) {};
                        }

                        if (google && value && (ggv.gps!= 'off') && !ggv.gpsPosition) {
                            ggv.doGeoUpdate(function(geo){});
                        }
                    }
                }
            }]
        },{
            xtype:          'fieldset',
            id:             'notesfieldset',
            title:          'My Notes',
            enableLocale:   true,
            locales:        { title: 'settings.notes.title' },
            style:      'font-size: 80%;',

            defaults: {
                name:         'notes',
                width:        '100%',
                labelWidth:   '70%',
                enableLocale: true
            },

            items: [{
                xtype:    'togglefield',
                id:       'notesToggleField',
                locales:  { label : 'settings.notes.fieldlabel' },
                label:    'display notes in listings',

                listeners: {
                    initialize: function(me) {
                        me.setValue(GayGuideApp.ggv.notes=='on');
                    },

                    change: function(me, newvalue, oldvalue, eOpts) {
                        GayGuideApp.ggv.notes = me.getValue()?'on':'off';
                        createCookie('notes', GayGuideApp.ggv.notes, 0, 300);
                    }
                }
            }]
        },{
            xtype:          'fieldset',
            id:             'langfieldset',
            enableLocale:   true,
            locales:        { title: 'settings.lang.title' },
            style:          'font-size: 80%;',

            defaults: {
                name:         'lang',
                width:        '100%',
                labelWidth:   '70%',
                minHeight:    '45px',
                xtype:        'radiofield',
                checked:      false,
                enableLocale: true,

                listeners: {
                    check: function (a) {
                        var     newlang, oldlang = GayGuideApp.lang;

                        if (a.id == 'englishCheck') newlang = 'en';
                        if (a.id == 'espanolCheck') newlang = 'es';
                        if (a.id == 'frenchCheck')  newlang = 'fr';

                        if (oldlang == newlang) return;

                        Ext.Msg.show({
                            title:  "Gay Guide Vallarta",
                            message: trans("ChangeLangQuestion"),
                            width: 300,
                            buttons: [
                               {enableLocale: true, locales: { text: 'buttons.no' },  itemId: 'no'},
                               {enableLocale: true, locales: { text: 'buttons.yes' }, itemId: 'yes', ui: 'action'}
                            ],
                            fn: function(b, v, o) {
                                var     x = Ext.Viewport.query('#langfieldset')[0];

                                if (b == 'yes') {
                                    if (oldlang != newlang) {
                                        GayGuideApp.lang = newlang;
                                        createCookie('t_lang', GayGuideApp.lang, 0, 300);
                                        GayGuideApp.langtext = loadLanguages(GayGuideApp.lang);
                                        Ux.locale.Manager.updateLocale(GayGuideApp.lang, function() {
                                            var     mgr = Ux.locale.Manager,
                                                months = [];

                                            for (i=1; i<=12; i++)  {
                                                months.push(mgr.get("months."+i))
                                            }
                                            Ext.Date.monthNames = months;
                                            GayGuideApp.app.getApplication().getController('MainController').reloadDataStores(GayGuideApp.lang);
                                        });
                                    }
                                    return;
                                }

                                if (GayGuideApp.lang == 'en') {
                                    x.getComponent(0).check();
                                }
                                else if (GayGuideApp.lang == 'es') {
                                    x.getComponent(1).check();
                                }
                                else if (GayGuideApp.lang == 'fr') {
                                    x.getComponent(2).check();
                                }
                            }
                        });
                    }
                }
            },

            items: [{
                id:       'englishCheck',
                locales:  { label : 'settings.lang.english' },
                checked:  (GayGuideApp.lang == 'en')
            },{
                id:       'espanolCheck',
                locales:  { label : 'settings.lang.spanish' },
                checked:  (GayGuideApp.lang == 'es')
            },{
                id:       'frenchCheck',
                locales:  { label : 'settings.lang.french' },
                checked:  (GayGuideApp.lang == 'fr')
            }]
        },
        {
            xtype:  'component',
            styleHtmlContent: true,
            width:  '100%',
            cls:    'ggv-author',
            html:   '<div class="ggv-author-inner"><center>App by Mark Alan Page<br />Vallarta APP Forge<br />'+
                    '<br />GayGuideApp<br />&copy; 2011-2015 Gay Guide Vallarta<br /><br />'+
                    ggv_vsnDate()+
                    '</center></div>'
        }],

        listeners: {
            painted: function() {
				GayGuideApp.ggv.clearStatusBar();
                reportView('/touch/settings');
            }
        }
    }
});

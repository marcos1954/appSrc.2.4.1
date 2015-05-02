/**
 *
 */
Ext.define('Ux.locale.override.st.Component', {
    override : 'Ext.Component',

    requires : [
        'Ux.locale.Manager'
    ],

    enableLocale : false,
    locale       : null,
    locales      : null,

    constructor : function(config) {
        var me = this;

        //if (config  && ((config.xtype == 'fieldset')  ||  ( config.xtype == 'togglefield')  ||  true))
        //    console.log(config.xtype, config.id);

        config = Ux.locale.Manager.isLocalable(me, config);

        me.callParent([config]);

        if (me.enableLocale) {
            me.setLocale(Ux.locale.Manager.getLanguage());
        }
    },

    setLocale : function(locale) {
        var me          = this,
            locales     = me.locales || me.getInitialConfig().locales,
            html        = (locales)?locales.html:null,
            manager     = me.locale,
            defaultText = '';

        if (html) {
            if (Ext.isObject(html)) {
                defaultText = html.defaultText;
                html        = html.key;
            }

            html = manager.get(html, defaultText);

            if (Ext.isString(html)) {
                me.setHtml(html);
            }
        }
    }
});

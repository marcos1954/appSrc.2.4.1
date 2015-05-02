/**
 * override Device contructor for Standalone cae (webapp launch from homescreen on iOS)
 */
Ext.define('GayGuideApp.controller.override.Device', {
	override: 'Ext.device.Device',
	singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.device.PhoneGap',
        'Ext.device.device.Sencha',
        'Ext.device.device.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.PhoneGap) {
                return Ext.create('Ext.device.device.PhoneGap');
            }
            else if (Ext.browser.is.Standalone) {
				return Ext.create('Ext.device.device.Abstract');
            }
			else {
				return Ext.create('Ext.device.device.Sencha');
			}
        }
        else {
            return Ext.create('Ext.device.device.Simulator');
        }
    }
});

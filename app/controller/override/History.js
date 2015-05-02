Ext.define('GayGuideApp.controller.override.History',{
    override:'Ext.app.History',
    //Add 'false' to the call to redirect so that it doesn't add a new action element. 
    back: function() {
        var actions = this.getActions(),
            previousAction = actions[actions.length - 2];

        if (previousAction) {
            console.log('BACK: popping action');
            actions.pop();
            previousAction.getController().getApplication().redirectTo(previousAction.getUrl(),false);
        }
        else {
            console.log('BACK: no previousAction');
            actions[actions.length - 1].getController().getApplication().redirectTo('');
        }
    }
});

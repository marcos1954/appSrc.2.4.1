/**
 * GayGuideApp.model.Business
 *
 *
 *
 *
 *
 */
Ext.define("GayGuideApp.model.Business", {
    extend: 'GayGuideApp.model.BaseModel',

    requires: [
        'Ext.data.identifier.Uuid'
    ],

    config: {
        idProperty: 'uid',
        identifier: 'uuid',
        fields: [{
            name: "uid",
            type: "auto"
        },{
            name: "id",
            type: "int"
        },{
            name: "fav",
            type: "int",
            persist: false
        },{
            name: "lastVisit",
            type: "int",
            persist: false
        },{
            name: "list_dirref",
            type: "string"
        },{
            name: "list_name",
            type: "string"
        },{
            name: "list_latitude",
            type: "string"
        },{
            name: "list_longitude",
            type: "string"
        },{
            name: "list_addr1",
            type: "string"
        },{
            name: "list_addr2",
            type: "string"
        },{
            name: "list_addr3",
            type: "string"
        },{
            name: "list_phone",
            type: "string"
        },{
            name: "list_cat",
            type: "string"
        },{
            name: "list_cat_page",
            type: "string"
        },{
            name: "list_cat_name",
            type: "string"
        },{
            name: "list_descshort",
            type: "string"
        },{
            name: "list_desclong",
            type: "string"
        },{
            name: "list_src",
            type: "string"
        },{
            name: "list_width",
            type: "int"
        },{
            name: "list_height",
            type: "int"
        },{
            name: "list_pix1",
            type: "string"
        },{
            name: "list_pix2",
            type: "string"
        },{
            name: "list_pix3",
            type: "string"
        },{
            name: "list_pix4",
            type: "string"
        },{
            name: "list_pix5",
            type: "string"
        },{
            name: "list_pix6",
            type: "string"
        },{
            name: "list_pix7",
            type: "string"
        },{
            name: "list_pix8",
            type: "string"
        },{
            name: "list_pix9",
            type: "string"
        },{
            name: "list_menu_pix1",
            type: "string"
        },{
            name: "list_menu_pix2",
            type: "string"
        },{
            name: "list_menu_pix3",
            type: "string"
        },{
            name: "list_menu_pix4",
            type: "string"
        },{
            name: "list_menu_pix5",
            type: "string"
        },{
            name: "list_menu_pix6",
            type: "string"
        },{
            name: "list_menu_pix7",
            type: "string"
        },{
            name: "list_menu_pix8",
            type: "string"
        },{
            name: "notes",
            type: "string"
        },{
            name: "list_tags",
            type: "string"
        },
        {
            name: "list_tagcodes",
            type: "string"
        }

        ],
        hasMany: {
            model: 'GayGuideApp.model.Event',
            name: 'events'
        }
    }
});

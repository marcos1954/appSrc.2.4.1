/**
 *
 */
Ext.define('Ux.webstorage.WebStorage', {
    override: 'Ext.data.proxy.WebStorage',

    read: function(operation, callback, scope) {
        console.log('in custom WebStorage.read()');
        var records    = [],
            ids        = this.getIds(),
            model      = this.getModel(),
            idProperty = model.getIdProperty(),
            params     = operation.getParams() || {},
            length     = ids.length,
            i, record, filters, tmpRecords = [];

        filters = operation.getFilters() || [];

        //read a single record
        if (params[idProperty] !== undefined) {
            record = this.getRecord(params[idProperty]);
            if (record) {
                tmpRecords.push(record);
                //operation.setSuccessful();
            }
        } else {
            for (i = 0; i < length; i++) {
                tmpRecords.push(this.getRecord(ids[i]));
                //operation.setSuccessful();
            }
        }

        // remove items that dont match filter
        if(filters.length > 0)
        {
            for(i = 0; i < tmpRecords.length; i++)
            {
                var add = true;

                for(var x = 0; x < filters.length; x++)
                {
                    if(tmpRecords[i].data[filters[x]._property] != filters[x]._value)
                    {
                        add = false;
                    }
                }

                if(add)
                {
                    records.push(tmpRecords[i]);
                }
            }
        }
        else
        {
            records = tmpRecords;
        }

        if(records.length > 0)
        {
            operation.setSuccessful();
        }

        operation.setCompleted();

        operation.setResultSet(Ext.create('Ext.data.ResultSet', {
            records: records,
            total  : records.length,
            loaded : true
        }));
        operation.setRecords(records);

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    }
});

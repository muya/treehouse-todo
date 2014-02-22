var todoDB = (function() {
    var tDB = {};
    var datastore = null;
    
    /**
     * open a connection to the datastore
     * @param {type} callback
     * @returns {undefined}
     */
    tDB.open = function (callback){
        //database version
        var version = 1;
        
        //open a connection to the datastore
        var request = indexedDB.open('todos', version);
    }

    //add methods for db interaction

    //export the tDB object
    return tDB;
});
var todoDB = (function() {
    var tDB = {};
    var datastore = null;

    /**
     * open a connection to the datastore
     * @param {type} callback
     * @returns {undefined}
     */
    tDB.open = function(callback) {
        //database version
        var version = 1;

        //open a connection to the datastore
        var request = indexedDB.open('todos', version);

        //handle datastore upgrades
        request.onupgradeneeded = function(e) {
            var db = e.target.result;

            e.target.transaction.onerror = tDB.onerror;

            //delete the old datastroe
            if (db.objectStoreNames.contains('todo')) {
                db.deleteObjectStore('todo');
            }

            //create a new database
            var store = db.createObjectStore('todo', {
                keyPath: 'timestamp'
            });
        };

        //handle successfull datastore access
        request.onsuccess = function(e) {
            //get a reference to the db
            datastore = e.target.result;

            //execute the callback
            callback();
        };

        //handle errors when opening the datastore
        request.onerror = tDB.onerror;
    }

    /**
     * fetch all of the todo items in the datastore
     * @param {type} callback
     * @returns {undefined}
     */
    tDB.fetchTodos = function(callback) {
        var db = datastore;
        var transaction = db.transaction(['todo'], 'readwrite');
        var objStore = transaction.objectStore('todo');

        var keyRange = IDBKeyRange.lowerBound(0);

        var cursorRequest = objStore.openCursor(keyRange);

        var todos = [];

        transaction.oncomplete = function(e) {
            //execute the callback function
            callback(todos);
        };

        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;

            if (!!result == false) {
                return;
            }

            todos.push(result.value);

            result.continue();
        };

        cursorRequest.onerror = tDB.onerror;
    };

    /**
     * create a new todo item
     * @param {type} text
     * @param {type} callback
     * @returns {undefined}
     */
    tDB.createTodo = function(text, callback) {
        //get a reference to the db
        var db = datastore;

        //initiate a new transaction
        var transaction = db.transaction(['todo'], 'readwrite');

        //get the datastore
        var objStore = transaction.objectStore('todo');

        //create a timestamp for the todo item
        var timestamp = new Date().getTime();

        //create an object for the todo item
        var todo = {
            'text': text,
            'timestamp': timestamp
        };

        //create the datastore request
        var request = objStore.put(todo);

        //handle a successful datastore put
        request.onsuccess = function(e) {
            //execute callback
            callback(todo);
        };

        //handle errors
        request.onerror = tDB.onerror;

    };

    tDB.deleteTodo = function(id, callback) {
        var db = datastore;
        var transaction = db.transaction(['todo'], 'readwrite');
        var objStore = transaction.objectStore('todo');

        var request = objStore.delete(id);

        request.onsuccess = function(e) {
            callback();
        };

        request.onerror = function(e) {
            console.log(e);
        };
    };

    //export the tDB object
    return tDB;
});
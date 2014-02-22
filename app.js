window.onload = function() {
    //display the todo items
    todoDB.open(refreshTodos);

    //get references to the form elements
    var newTodoForm = document.getElementById('new-todo-form');
    var newTodoInput = document.getElementById('new-todo');

    //handle new todo item form submissions
    newTodoForm.onsubmit = function() {
        console.log('submit invoked');
        //get the todo text
        var text = newTodoInput.value;

        //check to ensure text isn't blank or just spaces
        if (text.replace(/ /g, '') !== '') {
            //create the todo item 
            console.log('about to create new todo with text: ' + text);
            todoDB.createTodo(text, function(todo) {
                refreshTodos();
            });
        }
        else{
            console.log('found emptiness only' + text);
        }

        //reset the input field
        newTodoInput.value = '';

        //don't send the form
        return false;
    };
};

function refreshTodos() {
    console.log('about to refresh to dos...')
    todoDB.fetchTodos(function(todos) {
        var todoList = document.getElementById('todo-items');
        todoList.innerHTML = '';

        for (var i = 0; i < todos.length; i++) {
            //read the todo items backwards (most recent first)
            var todo = todos[(todos.length - 1 - i)];

            var li = document.createElement('li');
            li.id = 'todo-' + todo.timestamp;

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.setAttribute('data-id', todo.timestamp);

            li.appendChild(checkbox);

            var span = document.createElement('span');
            span.innerHTML = todo.text;

            li.appendChild(span);

            todoList.appendChild(li);

            //set up an event listener for the checkbox
            checkbox.addEventListener('click', function(e) {
                var id = parseInt(e.target.getAttribute('data-id'));

                todoDB.deleteTodo(id, refreshTodos);
            });
        }
    });
}
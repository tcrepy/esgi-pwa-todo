import {openDB} from "idb";
import AddTodoBtn from "./components/add-todo-btn";
import TodoElement from "./components/todo-element";

(async function (document) {

    //Préchargement de la page
    const app = document.querySelector('#app');
    const skeleton = app.querySelector('.skeleton');
    const listPage = app.querySelector('[page=list]');
    skeleton.removeAttribute('active');
    listPage.setAttribute('active', '');

    //récupération des todo-elements
    try {
        const database = await openDB("app-store", 1, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore('todo-element', {
                    // The 'id' property of the object will be the key.
                    keyPath: 'id',
                    // If it isn't explicitly set, create a value by auto incrementing.
                    autoIncrement: true,
                });
                // Create an index on the 'date' property of the objects.
                store.createIndex('title', 'title');
            },
        });
        let allTodo = await database.get('todo-element', 'todo-element');
        if (typeof allTodo === 'undefined') {
            allTodo = [];
        }

        //creation des todoelement dans le dom
        allTodo.map(elem => {
            let todoElement = new TodoElement();
            todoElement.init(elem.title, elem.active);
            listPage.appendChild(todoElement);
            return todoElement;
        });

        document.addEventListener('new-todo', e => {
            allTodo.push({
                title: e.detail,
                active: true
            });
            database.put('todo-element', allTodo, 'todo-element');
            //création de l'element dans le dom
            let todoElement = new TodoElement();
            todoElement.init(e.detail, true);
            listPage.appendChild(todoElement);
            return todoElement;
        });
    } catch (e) {
        console.log(e);
    }
})(document);
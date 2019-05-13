import {openDB} from "idb";
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
        const database = await openDB("todo-store", 1, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore('todo');
            },
        });
        let allTodo = await database.get('todo', 'todo');
        if (typeof allTodo === 'undefined') {
            allTodo = [];
        }
        console.log(allTodo);

        //creation des todoelement dans le dom
        allTodo.map(elem => {
            let todoElement = new TodoElement();
            todoElement.init(elem.title, elem.active, elem.id);
            listPage.appendChild(todoElement);
            return todoElement;
        });
        document.addEventListener('check-task', e => {
            allTodo[e.detail.id] = {
                title: e.detail.title,
                active: e.detail.active,
                id: e.detail.id
            };
            database.put('todo', allTodo, 'todo');
        });
        document.addEventListener('new-todo', e => {
            let id = allTodo.length;
            allTodo.push({
                title: e.detail,
                active: true,
                id: id
            });
            database.put('todo', allTodo, 'todo');
            //création de l'element dans le dom
            let todoElement = new TodoElement();
            todoElement.init(e.detail, true, id);
            listPage.appendChild(todoElement);
            return todoElement;
        });
    } catch (e) {
        console.log(e);
    }
})(document);
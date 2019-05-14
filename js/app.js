import WcTodoElement from "./components/todo/wc-todo-element";
import Db from "./components/database/db";

(async function (document) {
    //Préchargement de la page
    const app = document.querySelector('#app');
    const skeleton = app.querySelector('.skeleton');
    const listPage = app.querySelector('[page=list]');
    skeleton.removeAttribute('active');
    listPage.setAttribute('active', '');
    const list = document.querySelector('.list');

    //récupération des todo-elements
    const database = await new Db("http://localhost:8888/");
    await database.init();

    let allTodo = await database.getTodos();
    //creation des todoelement dans le dom
    allTodo.map(todo => {
        createTodoElem(todo, list)
    });

    document.addEventListener('check-task', e => {
        database.updateTodo(e.detail);
    });


    document.addEventListener('new-todo', (e) => {
        database.createTodo(e.detail)
            .then(todo => {
                //création de l'element dans le dom
                createTodoElem(todo, list)
            })
    });

    document.getElementById('clear-db').addEventListener('click', async e => {
        await clearDb(database, list);
    });
})(document);

async function clearDb(database, list) {
    database.clearDb();
    list.innerHTML = '';
}

function createTodoElem(todo, list) {
    let todoElement = new WcTodoElement();
    todoElement.init(todo.title, todo.active, todo.id);
    list.appendChild(todoElement);
    return todoElement;
}
import {openDB} from "idb";

export default class Db {
    constructor(api_uri) {
        this.local_database = {};
        this.api_uri = api_uri;
        this.api_uri_todos = this.api_uri + "todos/";
        this.isOnline = navigator.onLine;
        document.addEventListener('connexion-changed', e => {
            this.isOnline = e.detail;
            if (this.isOnline && this.queue.length > 0) {
                this.queue.map(async qElem => {
                    await fetch(qElem.uri, {
                        method: qElem.method,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(qElem.todo)
                    });
                })
            }
        });
        this.queue = [];
    }

    async init() {
        this.local_database = await openDB("todo-store", 1, {
            upgrade(db) {
                // Create a store of objects
                const store = db.createObjectStore('todo');
            },
        });
    }

    async getTodos() {
        let alltodos;
        if (this.isOnline) {
            alltodos = await fetch(this.api_uri_todos)
                .then(async data => {
                    const json = await data.json();
                    if (this.isOnline) {
                        await this.local_database.put('todo', json, 'todo');
                    }
                }).catch(async err => {
                    console.log(err);
                });
        }
        alltodos = await this.local_database.get('todo', 'todo');
        if (typeof alltodos === 'undefined') {
            alltodos = [];
        }
        return alltodos;
    }

    async updateTodo(todo) {
        todo = {
            title: todo.title,
            active: todo.active,
            id: todo.id
        };

        //update local_db
        let allTodos = await this.local_database.get('todo', 'todo');
        allTodos[todo.id] = todo;
        this.local_database.put('todo', allTodos, 'todo')
            .then(async () => {
                //update api
                if (this.isOnline) {
                    await fetch(this.api_uri_todos + todo.id, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(todo)
                    }).catch(err => {
                        this.queue.push({
                            uri: this.api_uri_todos + todo.id,
                            method: "PUT",
                            todo: todo
                        });
                    })
                } else {
                    this.queue.push({
                        uri: this.api_uri_todos + todo.id,
                        method: "PUT",
                        todo: todo
                    });
                }
            });
    }

    async createTodo(title) {
        let allTodo = await this.local_database.get('todo', 'todo');
        if (typeof allTodo === "undefined") {
            allTodo = [];
        }
        let newTodo = {
            title: title,
            active: true,
            id: allTodo.length + 1
        };
        if (this.isOnline) {
            //update api
            fetch(this.api_uri_todos, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            }).catch(err => {
                this.queue.push({
                    uri: this.api_uri_todos,
                    method: "POST",
                    todo: newTodo
                });
            });
        } else {
            this.queue.push({
                uri: this.api_uri_todos,
                method: "POST",
                todo: newTodo
            });
        }
        allTodo.push(newTodo);
        this.local_database.put('todo', allTodo, 'todo');

        return newTodo;
    }

    async deleteFromDb(id) {
        await fetch(this.api_uri_todos + id, {
            method: "DELETE"
        });
    }

    async clearDb() {
        await this.local_database.delete('todo', 'todo');
        if (this.isOnline) {
            let allTodos = await fetch(this.api_uri_todos);
            allTodos = await allTodos.json();
            allTodos.map(async elem => {
                await this.deleteFromDb(elem.id);
            });
        }
    }
}
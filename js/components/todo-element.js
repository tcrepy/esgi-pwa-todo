import {css, html, LitElement} from "lit-element";

export default class TodoElement extends LitElement {
    constructor() {
        super();
        this.title = "";
        this.active = false;
        this.id = 0;
    }

    init(title, active, id) {
        this.title = title;
        this.active = active;
        this.id = id;
    }

    static get properties() {
        return {
            title: {type: String},
            active: {type: Boolean}
        }
    }

    static get styles() {
        return css`
            .todo-elem {
                padding: 15px;
                border-bottom: 1px solid #ababab;
                display: flex;
                align-items: center;
                width: 100%;
                box-sizing: border-box;
                flex-direction: row;
                justify-content: center;
            }
            
            .todo-elem div {
                display: inline-block;
            }  
            
            .todo-elem > .content {
                width: 85%;
                word-break: break-all;
            }
            
            .todo-elem .delete-elem {
                font-weight: bolder;
                float: right;
                margin: 0 15px;
            }
            
            .inactive {
                text-decoration: line-through;
            }
        `
    }

    clickTask() {
        this.active = !this.active;
    }

    firstUpdated(_changeProperty) {
        this.shadowRoot.querySelector('.todo-elem > .delete-elem').addEventListener('click', e => {
            this.clickTask();
            let event = new CustomEvent('check-task', {
                detail: this
            });
            document.dispatchEvent(event);
        })
    }

    render() {
        let classInactive = !this.active ? 'inactive' : '';
        let symbol = !this.active ? '✖' : '✔';
        return html`
            <div class="todo-elem" data-id="${this.id}">
                <div class="content ${classInactive}">${this.title}</div><span class="delete-elem">${symbol}</span>
            </div>
        `
    }
}

customElements.define('todo-elem', TodoElement);
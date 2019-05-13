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
            .inactive {
                text-decoration: line-through;
            }
        `
    }

    clickTask() {
        this.active = !this.active;
    }

    firstUpdated(_changeProperty) {
        this.shadowRoot.querySelector('.todo-elem').addEventListener('click', e => {
            this.clickTask();
            let event = new CustomEvent('check-task', {
                detail: this
            });
            document.dispatchEvent(event);
        })
    }

    render() {
        let classInactive = !this.active ? 'inactive' : '';
        return html`
            <div class="todo-elem" data-id="${this.id}">
                <p class="content ${classInactive}">${this.title}</p>
            </div>
        `
    }
}

customElements.define('todo-elem', TodoElement);
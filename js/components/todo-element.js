import {css, html, LitElement} from "lit-element";

export default class TodoElement extends LitElement {
    constructor() {
        super();
        this.title = "";
        this.active = false;
    }

    init(title, active) {
        this.title = title;
        this.active = active;
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

    render() {
        let classInactive = !this.active ? 'inactive' : '';
        return html`
            <div class="todo-elem">
                <p class="content ${classInactive}">${this.title}</p>
            </div>
        `
    }
}

customElements.define('todo-elem', TodoElement);
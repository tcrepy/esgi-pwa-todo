import {css, html, LitElement} from "lit-element";

export default class AddTodoBtn extends LitElement {
    constructor() {
        super();
        this.title = "";
        this.placeholder = "";
    }

    static get properties() {
        return {
            title: {type: String},
            placeholder: {type: String}
        }
    }

    static get styles() {
        return css`
            :root {
                background: #f5f6fa;
                color: #9c9c9c;
                font: 1rem "PT Sans", sans-serif;
            }

            a {
                color: inherit;
            }
            a:hover {
                color: #7f8ff4;
            }
            
            .container {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .uppercase {
                text-transform: uppercase;
            }
            
            .btn {
                display: inline-block;
                background: transparent;
                color: inherit;
                font: inherit;
                border: 0;
                outline: 0;
                padding: 0;
                transition: all 200ms ease-in;
                cursor: pointer;
            }
            .btn--primary {
                background: #7f8ff4;
                color: #fff;
                box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
                border-radius: 2px;
                padding: 1vh;
            }
            .btn--primary:hover {
                background: #6c7ff2;
            }
            .btn--primary:active {
                background: #7f8ff4;
                box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.2);
            }
            .btn--inside {
                margin-left: -96px;
            }
            
            .form__field {
                width: 360px;
                background: #fff;
                color: #5a5a5a;
                font: inherit;
                box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
                border: 0;
                outline: 0;
                padding: 22px 18px;
            }
        `
    }

    addTodo() {
        let newTodo = this.shadowRoot.querySelector('.form__field');
        if (newTodo.value !== '') {
            const event = new CustomEvent('new-todo', {
                detail: newTodo.value
            });
            document.dispatchEvent(event);
            newTodo.value = '';
        }
    }

    firstUpdated(_changeProperty) {
        const btn = this.shadowRoot.querySelector('.btn');
        btn.addEventListener('click', () => {
            this.addTodo();
        });
        const input = this.shadowRoot.querySelector('input');
        input.addEventListener('keydown', e => {
            if (e.keyCode == 13) {
                btn.click();
            }
        })
    }

    render() {
        return html`
            <div class="container">
                <div class="container__item">
                    <input type="text" class="form__field" placeholder="${this.placeholder}" />
                    <button class="btn btn--primary btn--inside uppercase">${this.title}</button>
                </div>
            </div>
        `;
    }
}

customElements.define('add-todo-btn', AddTodoBtn);
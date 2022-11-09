// static get properties() {
//   return {
//     dataModel: { attribute: false },
//   }
//  }

// static get observedAttributes() {
//   return ['dataModel'];
// }

customElements.define('select-word',
  class extends HTMLElement {

    #DROPDOWNBUTTON_WIDTH = 100;
    #dataModel;
    #form;
    #input;
    #span;
    #style;
    #isConnected;

    constructor() {
      super();
      this.dataModel;
    }

    get dataModel() {
      return this.#dataModel;
    }

    set dataModel(value) {
      this.#dataModel = value;
      this.udpateModel();
    }

    connectedCallback() {
      //console.log('connectedCallback');
      this.#isConnected = true;
      this.createStructure();
      this.udpateModel();
    }

    disconnectedCallback() {
      //console.log('disconnectedCallback');
    }

    adoptedCallback() {
      //console.log('adoptedCallback');
    }

    attributeChangedCallback(name, oldValue, newValue) {
      //console.log(newValue);
      //console.log('attributeChangedCallback', name, JSON.stringify(oldValue), JSON.stringify(newValue));
    }

    createStructure() {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      this.#form = document.createElement('form');
      this.#input = document.createElement('select');
      this.#span = document.createElement('span');
      const externalStyle = document.head.querySelector('#word-style')
      this.#style = document.createElement('style');
      this.#style.textContent = externalStyle.textContent;

      shadowRoot.appendChild(this.#style);
      shadowRoot.appendChild(this.#form);
      shadowRoot.appendChild(this.#span);

      this.#span.textContent = this.textContent;
      this.#input.value = this.textContent;

      this.#form.appendChild(this.#input);
      this.#form.style.display = 'none';
      this.#span.style.display = 'inline-block';
      this.#span.className = 'word-span';

      this.setAttribute('tabindex', '0');
      this.#input.setAttribute('required', 'required');
      this.#style.display = 'inline-block';
      const showInput = this.showInput.bind(this);  
      this.addEventListener('click', showInput);
      this.addEventListener('keydown', (e) => {
          if(e.key == "Enter") {
          showInput();
        }
      });
      this.#input.addEventListener('blur', this.updateDisplay.bind(this));
    }

    showInput() {
      this.#span.style.display = 'none';
      this.#form.style.display = 'inline-block';
      this.#input.style.width = (this.#span.clientWidth + this.#DROPDOWNBUTTON_WIDTH) + 'px';
      this.#input.focus();
    }

    updateDisplay() {
      this.#span.style.display = 'inline-block';
      this.#form.style.display = 'none';
      this.#span.textContent = this.#input.value;
      this.#input.style.width = this.#span.clientWidth + 'px';
      const value = this.#input.value;
      this.dataModel.selectedItem.id = value ? this.dataModel.items.find(i => i.name === value).id : null;
      this.dispatchEvent(new CustomEvent('select-word-event', {bubbles: true, composed: true, detail: this.dataModel}));
    }

    udpateModel() {
      if (this.#isConnected && this.dataModel && this.dataModel.items) {
        const options = [];
        this.dataModel.items.forEach(item => {
          const option = document.createElement('option');
          option.textContent = item.name;
          option.setAttribute('data-value', item.id);
          if (item.id == this.dataModel.selectedItem.id) {
            option.setAttribute("selected", true);
            this.#span.textContent = item.name;
          }
          options.push(option);
        });
        this.#input.replaceChildren(...options);
      }
    }
  }
);

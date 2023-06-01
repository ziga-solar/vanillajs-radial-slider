const template = document.createElement('template');
template.innerHTML = `
<div class="container">
    <input class="slider" type="range" id="slider" name="slider" min="0" max="0" step="0">
    <label class="input-label" for="slider">Slider</label>
    <span class="slider-value">$ 0</span>
</div>
`;
class RangeSlider extends HTMLElement {
    _config;
    shadowRoot = this.attachShadow({mode: 'open'});
    sliderElement; 
    sliderValue
    constructor(){
        super();
        let templateClone = template.content.cloneNode(true);
        this.shadowRoot.append(templateClone);
        this.sliderElement = this.shadowRoot.querySelector('.slider');
        this.sliderValue = this.shadowRoot.querySelector('.slider-value');
        this.sliderElement.addEventListener('input', ()=>{
            this.updateReactiveValue(this.sliderElement.value);
        })

    }

    static get observedAttributes() {
        return ['config'];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (oldVal !== newVal) {
            if(attrName === 'config'){
                this.updateSliderProperties(JSON.parse(newVal));
            }
        }
    }

    get config() {
        return this._config;
    }

    set config(newVal) {
        this._config = newVal;
        if (newVal) {
            this.updateSliderProperties(newVal);
        }
    }

    updateSliderProperties(config) {
        const sliderLabel = this.shadowRoot.querySelector('.input-label')
        this.sliderElement.min = config.min || '0';
        this.sliderElement.max = config.max || '0';
        this.sliderElement.step = config.step || '0';
        this.sliderElement.name = config.container || 'default';
        sliderLabel.innerHTML = config.container || 'default'
    }

    updateReactiveValue(value){
        this.sliderValue.innerHTML = `\$ ${value}`;
    }
}

if(!customElements.get('range-slider')){
    customElements.define('range-slider', RangeSlider);
}

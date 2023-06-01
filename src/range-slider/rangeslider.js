const template = document.createElement('template');
template.innerHTML = `
<div class="container">
    <input class="slider" type="range" id="slider" name="slider" min="0" max="0" step="">
    <label class="input-label" for="slider">Slider</label>
</div>
`;

class RangeSlider extends HTMLElement {
    _config;
    shadowRoot = this.attachShadow({mode: 'open'});
    constructor(){
        super();
        let templateClone = template.content.cloneNode(true);
        this.shadowRoot.append(templateClone);
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
        const sliderElement = this.shadowRoot.querySelector('.slider');
        const sliderLabel = this.shadowRoot.querySelector('.input-label')
        sliderElement.min = config.min || '0';
        sliderElement.max = config.max || '0';
        sliderElement.step = config.step || '0';
        sliderElement.name = config.container || 'default';
        sliderLabel.innerHTML = config.container || 'default'
    }
}

customElements.define('range-slider', RangeSlider);
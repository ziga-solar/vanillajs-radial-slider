const template = document.createElement('template');
template.innerHTML = `
<div class="container">
    <input type="range" id="slider" name="slider" min="0" max="10">
    <label for="volume">Slider</label>
</div>
`;

class RangeSlider extends HTMLElement {
    constructor(){
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        let templateClone = template.content.cloneNode(true);
        shadowRoot.append(templateClone);
    }
}

customElements.define('range-slider', RangeSlider);
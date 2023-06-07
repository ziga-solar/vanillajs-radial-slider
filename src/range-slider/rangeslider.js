const template = document.createElement('template');
template.innerHTML = `
<style>
div.rs-container{
    width: 80vw;
    height: 80vw;
    margin: 0 auto;
    display: inline-block;
    touch-action: none;
    position: relative;
    pointer-events: none;
}
div.rs-container svg {
    width: 100%;
    height: 100%;
		position: absolute;
		pointer-events: none;	
}
div.rs-container svg circle.rs-tack{
	pointer-events: auto;	
}
div.rs-container svg circle.rs-progress{
    transform: rotate(-90deg);
    transform-origin: center;
}
div.rs-container svg circle.rs-slider {
    transform: rotate(-90deg);
    transform-origin: center;
}
div.rs-container svg text.rs-value-text {
    font: italic 4px sans-serif;
    -webkit-user-select: none;
        /* Safari */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* IE10+/Edge */
        user-select: none;
        /* Standard */
}
@media only screen and (min-width: 768px) {
  div.rs-container{
    width: 40vw;
    height: 40vw;
  }
}
</style>
<div class="rs-container">
	<svg
		viewBox="0 0 150 150"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle
			r="0"
			cx="75"
			cy="75"
			stroke-width="6px"
			stroke="lightgray"
			fill="gray"
			fill-opacity="0.0"
			class="rs-background"
		/>
		<circle
			r="0"
			cx="75"
			cy="75"
			stroke="white"
			stroke-width="6px"
			fill-opacity="0.0"
			class="rs-slider"
		/>
		<circle
			r="0"
			cx="75"
			cy="75"
			stroke-width="6px"
			stroke-opacity="0.5"
			fill-opacity="0.0"
			class="rs-progress"
		/>
		<circle
			r="4"
			fill="white"
			cx="75"
			cy="75"
			stroke="gray"
			stroke-width="0.5px"
			class="rs-tack"
		/>
		<text class="rs-value-text" text-anchor="middle"></text>
	</svg>
</div>

`;
class RangeSlider extends HTMLElement {
  _config;
  shadowRoot = this.attachShadow({ mode: 'open' });
  svgEl;
  tackEl;
  sliderEl;
  progressEl;
  backgroundEl;
  textEl;
  centerPos;
  isDraggable;
  isMouseOutside;
  percentage;
	currentStep;
  value;

  componentConfig = {
    valueRange: 0,
    numberOfSteps: 0,
    stepPercentage: 0,
    stepDegree: 0,
    stepRadian: 0,
    progressConst: 0,
  };

  constructor() {
    super();
    let templateClone = template.content.cloneNode(true);
    this.shadowRoot.append(templateClone);
    this.svgEl = this.shadowRoot.querySelector('svg');
    this.tackEl = this.svgEl.querySelector('.rs-tack');
    this.sliderEl = this.svgEl.querySelector('.rs-slider');
    this.progressEl = this.svgEl.querySelector('.rs-progress');
    this.backgroundEl = this.svgEl.querySelector('.rs-background');
    this.textEl = this.svgEl.querySelector('.rs-value-text');

    //add event listeners
    this.tackEl.addEventListener('mousedown', () => {
      this.setIsDraggable(true);
      this.isMouseOutside = false;
    });
    this.tackEl.addEventListener('mousemove', (ev) => {
      this.drag(ev);
    });
    this.tackEl.addEventListener('mouseleave', () => {
      this.isMouseOutside = true;
    });
    this.tackEl.addEventListener('mouseup', () => {
      this.setIsDraggable(false);
    });

    this.tackEl.addEventListener('touchstart', () => {
      this.setIsDraggable(true);
    });
    this.tackEl.addEventListener('touchmove', (ev) => {
      this.drag(ev);
    });
    this.tackEl.addEventListener('touchend', () => {
      this.setIsDraggable(false);
    });
    document.addEventListener('mouseup', () => {
      if (this.isDraggable) {
        this.tackEl.dispatchEvent(new Event('mouseup'));
      }
    });
    document.addEventListener('mousemove', (ev) => {
      if (this.isDraggable && this.isMouseOutside) {
        this.drag(ev);
      }
    });
  }

  static get observedAttributes() {
    return ['config'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      if (attrName === 'config') {
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
      const valueRange = newVal.max - newVal.min;
      const numberOfSteps = valueRange / newVal.step;
      const stepPercentage = 100 / numberOfSteps;
      const stepDegree = 360 / numberOfSteps;
      const stepRadian = (2 * Math.PI) / numberOfSteps;
      const progressConst = Math.ceil(2 * Math.PI * newVal.radius);
      this.componentConfig = {
        valueRange: valueRange,
        numberOfSteps: numberOfSteps,
        stepPercentage: stepPercentage,
        stepDegree: stepDegree,
        stepRadian: stepRadian,
        progressConst: progressConst,
      };
      this.setupSlider(newVal);
      this.updateReactiveValue(newVal.min);
    }
  }

  updateReactiveValue(val) {
    if(this.value != val){
      this.value = val;
      this.textEl.textContent = val;
      this.shadowRoot.dispatchEvent(new CustomEvent('rsChangeValue', {detail: {value: val}, composed: true, bubbles: true}))
    }

  }

  setupSlider(config) {
    this.backgroundEl.setAttributeNS(null, 'r', config.radius);
    this.progressEl.setAttributeNS(null, 'r', config.radius);
    this.sliderEl.setAttributeNS(null, 'r', config.radius);
    this.textEl.style.display = `none`;
    // retrieve bounding box of slider
    const rect = this.sliderEl.getBoundingClientRect();
    // correction to retrieve element center coordinates
    this.centerPos = this.getPosition(
      Math.abs(rect.height / 2 + rect.top),
      Math.abs(rect.width / 2 + rect.left)
    );

    this.moveTack(this.centerPos.y - config.radius, this.centerPos.x);

    this.isDraggable = false;
    this.isMouseOutside = false;
    this.percentage = 0;

    this.value = config.min;

    this.setProgressBar();
    this.progressEl.style.stroke = config.color;

    this.sliderEl.style.strokeDasharray = `${0.5} ${
      this.componentConfig.progressConst / this.componentConfig.numberOfSteps
    }`;
    this.sliderEl.style.strokeDashoffset = `${2}`;
  }

  drag(e) {
    if (this.isDraggable) {
      let coords;
	
      if (e.type === 'touchmove') {
        coords = this.getPosition(e.touches[0].clientY, e.touches[0].clientX);
      } else {
        coords = this.getPosition(e.clientY, e.clientX);
      }
      const angleRad = Math.atan2(
        coords.y - this.centerPos.y,
        coords.x - this.centerPos.x
      );
      const angleCalc = Math.floor((angleRad * 180) / Math.PI);
      // shift angle for one quadrant backwards
      const angleCalcShifted = angleCalc + 90;
      // calculate percentage
      const pct = Math.floor(
        angleCalcShifted < 0
          ? (angleCalcShifted + 360) / 3.6
          : angleCalcShifted / 3.6
      );

      // calculate the current step
      const step = Math.floor(pct / this.componentConfig.stepPercentage);
      // calculate the step in percent of full circle
      const percentageStep = step * this.componentConfig.stepPercentage;
      // calculate the radians of steps and shift angle for one quadrant forwards
      const radianStep =
        ((step * this.componentConfig.stepDegree - 90) * Math.PI) / 180;
      // check so bar doesn't move over 100% or below 0% unless the user rotates it for an extra 25%

      if (this.percentage - percentageStep > -75) {
        if (percentageStep - this.percentage > -75) {
          if (
            (percentageStep !== this.percentage)
          ) {
            this.percentage = percentageStep;
            this.updateReactiveValue(step * this._config.step + this._config.min);
            this.setProgressBar();
            const pointY =
              this.centerPos.y + this._config.radius * Math.sin(radianStep);
            const pointX =
              this.centerPos.x + this._config.radius * Math.cos(radianStep);
            this.moveTack(pointY, pointX);
          }
        } else {
          this.percentage = 100;
          this.updateReactiveValue(this._config.max);
          this.setProgressBar();
          this.moveTack(
            this.centerPos.y - this._config.radius,
            this.centerPos.x
          );
        }
      } else {
        this.percentage = 0;
        this.updateReactiveValue(this._config.min);
        this.setProgressBar();
        this.moveTack(this.centerPos.y - this._config.radius, this.centerPos.x);
      }
    }
  }

  setIsDraggable(draggable) {
    if (draggable) {
      this.textEl.style.display = `block`;
      this.svgEl.style.zIndex = 5;
    } else {
      this.textEl.style.display = `none`;
      this.svgEl.style.zIndex = 0;
    }
    this.isDraggable = draggable;
  }

  moveTack(y, x) {
    this.tackEl.setAttributeNS(null, 'cy', y);
    this.tackEl.setAttributeNS(null, 'cx', x);
    this.textEl.setAttributeNS(null, 'y', y - 4);
    this.textEl.setAttributeNS(null, 'x', x);
  }

  getPosition(y, x) {
    let CTM = this.svgEl.getScreenCTM();

    return {
      y: (y - CTM.f) / CTM.d,
      x: (x - CTM.e) / CTM.a,
    };
  }

  setProgressBar() {
    this.progressEl.style.strokeDasharray = `${
      (this.percentage * this.componentConfig.progressConst) / 100
    } ${this.componentConfig.progressConst}`;
  }
}

if (!customElements.get('range-slider')) {
  customElements.define('range-slider', RangeSlider);
}

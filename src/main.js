document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page is loaded');
  let i = 1;

  const sliderData = fiveSliders.sliderArray;
  const sliderContainerElement = document.querySelector('.slider-container');
  sliderData.forEach(slider => {
    const rangeSliderElement = document.createElement('range-slider');
    sliderContainerElement.appendChild(rangeSliderElement)
    rangeSliderElement.classList.add(`slider-${i}`)
    rangeSliderElement.config = sliderData[i-1];
    i = i + 1;
  });

});
function addDraggable(e) {
  //config
  const config = {
    step: 10,
    min: 0,
    max: 800,
    radius: 15,
    container: 'Transportation',
    color: '#444389',
    valueRange: 800 - 0,
    numberOfSteps: (800 - 0) / 10,
    stepPercentage: 100 / ((800 - 0) / 10),
    stepDegree: 360 / ((800 - 0) / 10),
    stepRadian: (2 * Math.PI) / ((800 - 0) / 10),
  };
  const radius = config.radius;
  const progressConst = Math.ceil(2 * Math.PI * radius);
  const svg = e.target;
  const tack = svg.querySelector('.rs-tack');
  const slider = svg.querySelector('.rs-slider');
  const progress = svg.querySelector('.rs-progress');
  const text = svg.querySelector('.rs-value-text');
  text.style.display = `none`;
  // retrieve bounding box of slider
  const rect = slider.getBoundingClientRect();
  // correction to retrieve element center coordinates
  const centerPos = getPosition(
    Math.abs(rect.height - rect.top / 2 + radius),
    Math.abs(rect.width - rect.left / 2 + radius)
  );

  tack.style.transform = `translate(${0}px, ${-radius}px)`;
  let isDraggable = false;
  let isMouseOutside = false;
  let percentage = 0;
  // range properties
  let value = config.min;

  // setup
  setProgressBar();
  progress.style.stroke = config.color;

  slider.style.strokeDasharray = `${0.25} ${progressConst / 100}`;
  slider.style.strokeDashoffset = `${0.25}`;

  tack.addEventListener('mousedown', () => {
    setIsDraggable(true);
    isMouseOutside = false;
  });
  tack.addEventListener('mousemove', drag);
  tack.addEventListener('mouseleave', () => {
    isMouseOutside = true;
  });
  tack.addEventListener('mouseup', () => {
    setIsDraggable(false);
  });

  tack.addEventListener('touchstart', () => {
    setIsDraggable(true);
  });
  tack.addEventListener('touchmove', drag);
  tack.addEventListener('touchend', () => {
    setIsDraggable(false);
  });
  document.addEventListener('mouseup', () => {
    if (isDraggable) {
      tack.dispatchEvent(new Event('mouseup'));
    }
  });
  document.addEventListener('mousemove', (ev) => {
    if (isDraggable && isMouseOutside) {
      drag(ev);
    }
  });

  function drag(e) {
    if (isDraggable) {
      let coords;

      if (e.type === 'touchmove') {
        coords = getPosition(e.touches[0].clientY, e.touches[0].clientX);
      } else {
        coords = getPosition(e.clientY, e.clientX);
      }

      const angleRad = Math.atan2(
        coords.y - centerPos.y,
        coords.x - centerPos.x
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
      const step = Math.floor(pct / config.stepPercentage);
      // calculate the step in percent of full circle
      const percentageStep = step * config.stepPercentage;
      // calculate the radians of steps and shift angle for one quadrant forwards
      const radianStep = ((step * config.stepDegree - 90) * Math.PI) / 180;
      // check so bar doesn't move over 100% or below 0% unless the user rotates it for an extra 25%
      if (percentage - percentageStep > -75) {
        if (percentageStep - percentage > -75) {
          if (
            (percentageStep !== percentage) &
            (percentageStep % config.stepPercentage === 0)
          ) {
            percentage = percentageStep;
            updateValue(step * config.step);
            setProgressBar();
            const pointY = centerPos.y + radius * Math.sin(radianStep);
            const pointX = centerPos.x + radius * Math.cos(radianStep);
            moveTack(pointY, pointX);
          }
        } else {
          percentage = 100;
          updateValue(config.max);
          setProgressBar();
          moveTack(centerPos.y - radius, centerPos.x);
        }
      } else {
        percentage = 0;
        updateValue(config.min);
        setProgressBar;
        moveTack(centerPos.y - radius, centerPos.x);
      }
    }
  }

  function setIsDraggable(draggable) {
    if (draggable) {
      text.style.display = `block`;
    } else {
      text.style.display = `none`;
    }
    isDraggable = draggable;
  }

  function moveTack(y, x) {
    tack.setAttributeNS(null, 'cy', y + radius);
    tack.setAttributeNS(null, 'cx', x);
    text.setAttributeNS(null, 'y', y - 4);
    text.setAttributeNS(null, 'x', x);
  }

  function getPosition(y, x) {
    let CTM = svg.getScreenCTM();

    return {
      y: (y - CTM.f) / CTM.d,
      x: (x - CTM.e) / CTM.a,
    };
  }
  function updateValue(val) {
    value = val;
    text.textContent = val;
  }

  function setProgressBar() {
    progress.style.strokeDasharray = `${
      (percentage * progressConst) / 100
    } ${progressConst}`;
  }
}

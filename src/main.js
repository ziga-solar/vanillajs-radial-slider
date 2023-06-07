document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page is loaded');
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
  // retrieve bounding box of slidert
  const rect = slider.getBoundingClientRect();
  // correction to retrieve element center coordinates
  const centerPos = getMousePosition(
    Math.abs(rect.height - rect.top / 2 + radius),
    Math.abs(rect.width - rect.left / 2 + radius)
  );
  moveTack(centerPos.y - radius, centerPos.x);

  let isDraggable = false;
  let isMouseOutside = false;
  let percentage = 0;
  // range properties
  let value = 0;

  // setup
  setProgressBar();
  progress.style.stroke = config.color;
  slider.style.strokeDasharray = `${0.2} ${
    progressConst / config.numberOfSteps
  }`;

  tack.addEventListener('mousedown', () => {
    isDraggable = true;
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
        coords = getMousePosition(e.touches[0].clientY, e.touches[0].clientX);
      } else {
        coords = getMousePosition(e.clientY, e.clientX);
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
            value = step * config.step;

            setProgressBar();
            const pointY = centerPos.y + radius * Math.sin(radianStep);
            const pointX = centerPos.x + radius * Math.cos(radianStep);
            moveTack(pointY, pointX);
          }
        } else {
          percentage = 100;
          value = config.max;
          setProgressBar();
          moveTack(centerPos.y - radius, centerPos.x);
        }
      } else {
        percentage = 0;
        value = config.min;
        setProgressBar;
        moveTack(centerPos.y - radius, centerPos.x);
      }
    }
  }

  function setIsDraggable(draggable) {
    isDraggable = draggable;
  }

  function moveTack(y, x) {
    tack.setAttributeNS(null, 'cy', y);
    tack.setAttributeNS(null, 'cx', x);
  }

  function getMousePosition(y, x) {
    let CTM = svg.getScreenCTM();

    return {
      y: (y - CTM.f) / CTM.d,
      x: (x - CTM.e) / CTM.a,
    };
  }

  function setProgressBar() {
    progress.style.strokeDasharray = `${
      (percentage * progressConst) / 100
    } ${progressConst}`;
  }
}

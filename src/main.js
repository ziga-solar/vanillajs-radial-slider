document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page is loaded');
});
function addDraggable(e) {
  const radius = 15;
  const svg = e.target;
  const tack = svg.querySelector('.rs-tack');
  const slider = svg.querySelector('.rs-slider');
  // retrieve center of SVG
  const rect = slider.getBoundingClientRect();
  const centerPos = getMousePosition(
    Math.abs(rect.height - rect.top / 2 + radius),
    Math.abs(rect.width - rect.left / 2 + radius)
  );
  tack.setAttributeNS(null, 'cy', centerPos.y - radius);
  tack.setAttributeNS(null, 'cx', centerPos.x);

  let isDraggable = false;

  tack.addEventListener('mousedown', () => {
    setIsDraggable(true);
  });
  tack.addEventListener('mousemove', drag);
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

  function drag(e) {
    if (isDraggable) {
      let coords;
      if (e.type === 'touchmove') {
        coords = getMousePosition(e.touches[0].clientY, e.touches[0].clientX);
      } else {
        coords = getMousePosition(e.clientY, e.clientX);
      }
      const angle = Math.atan2(coords.y - centerPos.y, coords.x - centerPos.x);
      const pointY = centerPos.y + radius * Math.sin(angle);
      const pointX = centerPos.x + radius * Math.cos(angle);

      moveTack(pointY, pointX);
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
}

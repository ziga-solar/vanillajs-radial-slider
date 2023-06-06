document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page is loaded');
});

function moveElement(el, x, y) {
  el.style.transform = `translate(${mouseX - x}px, ${mouseY - y}px)`;
}

function addDraggable(e) {
  let svg = e.target;
  let tack = svg.querySelector('.tack');
  let isDraggable = false;

  tack.addEventListener('mousedown', () => {
    setIsDraggable(true);
  });
  tack.addEventListener('mousemove', drag);
  tack.addEventListener('mouseup', () => {
    setIsDraggable(false);
  });

  function drag(e) {
    if (isDraggable) {
      let coords = getMousePosition(e);
      tack.setAttributeNS(null, 'cx', coords.x);
      tack.setAttributeNS(null, 'cy', coords.y);
    }
  }

  function setIsDraggable(draggable) {
    isDraggable = draggable;
  }

  function getMousePosition(e) {
    let CTM = svg.getScreenCTM();
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d,
    };
  }
}

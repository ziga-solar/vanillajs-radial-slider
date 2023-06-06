document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing page is loaded');

    let tackElement = document.querySelector('svg .tack');
    console.log(tackElement);
    tackElement.addEventListener('mousedown', (ev) => {
        console.log(ev);
    });
    tackElement.addEventListener('mouseup', () => {
        console.log('mouseup');
    });
    tackElement.addEventListener('touchstart', () => {
        console.log('touchstart');
    });
    tackElement.addEventListener('touchend', () => {
        console.log('mousedown');
    });
    tackElement.addEventListener('mousemove', () => {
        console.log('mousemove');
    });
    tackElement.addEventListener('touchmove', () => {
        console.log('touchmove');
    });
    console.log(tackElement);

})






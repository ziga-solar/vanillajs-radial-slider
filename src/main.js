document.addEventListener('DOMContentLoaded', ()=>{
    console.log('Landing page is loaded');

    const sliderData = oneSlider;

    const rangeSliderElement = document.querySelector('range-slider');

    rangeSliderElement.config = sliderData.sliderArray[0];
})




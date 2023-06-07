document.addEventListener('DOMContentLoaded', () => {
  console.log('Landing page is loaded');
  let i = 1;

  const sliderData = fiveSliders.sliderArray;
  const mainContainerElement = document.querySelector('.main-container');
  const sliderContainerElement = mainContainerElement.querySelector('.slider-container');
  const valueContainerElement = mainContainerElement.querySelector('.value-container');
  sliderData.forEach(slider => {
    const sliderId = `slider-${i}`;
    const rangeSliderElement = document.createElement('range-slider');
    const sliderValueTextContainerElement = document.createElement('div');
    const sliderValueTextElement = document.createElement('div');
    const sliderValueColorElement = document.createElement('div');
    const sliderValueCategoryElement = document.createElement('div');

    sliderContainerElement.appendChild(rangeSliderElement);
    sliderValueTextContainerElement.appendChild(sliderValueTextElement);
    sliderValueTextContainerElement.appendChild(sliderValueColorElement);
    sliderValueTextContainerElement.appendChild(sliderValueCategoryElement);
    valueContainerElement.appendChild(sliderValueTextContainerElement);

    sliderValueTextContainerElement.classList.add(sliderId);
    rangeSliderElement.classList.add(sliderId);
    sliderValueTextElement.classList.add('slider-value', 'slider-text')
    sliderValueColorElement.classList.add('slider-color')
    sliderValueCategoryElement.classList.add('slider-category', 'slider-text')

    rangeSliderElement.config = slider;
    rangeSliderElement.addEventListener('rsChangeValue', (e) => {
      sliderValueTextElement.innerHTML = `$${e.detail.value}`;
    });
    sliderValueTextElement.innerHTML =`$${slider.min}`;
    sliderValueColorElement.style.backgroundColor = `${slider.color}`
    sliderValueCategoryElement.innerHTML =`${slider.container}`;
    
    i = i + 1;
  });
});

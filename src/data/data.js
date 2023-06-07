const oneSlider = {
  sliderArray: [
    {
      container: 'Transportation',
      color: '#444389',
      max: 100,
      min: 0,
      step: 5,
      radius: 20,
    },
  ],
};

const twoSliders = {
  sliderArray: [
    oneSlider.sliderArray[0],
    {
      container: 'Food',
      color: '#1CCAD8',
      max: 1000,
      min: 0,
      step: 10,
      radius: 30,
    },
  ],
};

const threeSliders = {
  sliderArray: [
    twoSliders.sliderArray[0],
    twoSliders.sliderArray[1],
    {
      container: 'Insurance',
      color: '#1EAE4E',
      max: 900,
      min: 200,
      step: 10,
      radius: 40,
    },
  ],
};

const fourSliders = {
  sliderArray: [
    threeSliders.sliderArray[0],
    threeSliders.sliderArray[1],
    threeSliders.sliderArray[2],
    {
      container: 'Entertainment',
      color: '#FFEC51',
      max: 800,
      min: 30,
      step: 15,
      radius: 50,
    },
  ],
};

const fiveSliders = {
  sliderArray: [
    fourSliders.sliderArray[0],
    fourSliders.sliderArray[1],
    fourSliders.sliderArray[2],
    fourSliders.sliderArray[3],
    {
      container: 'Health care',
      color: '#FF674D',
      max: 1200,
      min: 500,
      step: 25,
      radius: 60,
    },
  ],
};

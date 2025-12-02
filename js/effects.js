const effectsList = document.querySelector('.effects__list');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectLevel = document.querySelector('.effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelSlider = document.querySelector('.effect-level__slider');

const Effects = {
  none: {
    filter: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

let currentEffect = 'none';

const initSlider = () => {
  effectLevelSlider.innerHTML = `
    <input type="range" min="0" max="100" value="100" class="effect-level__slider-element">
  `;

  const sliderElement = effectLevelSlider.querySelector('.effect-level__slider-element');

  sliderElement.addEventListener('input', (evt) => {
    const value = evt.target.value;
    effectLevelValue.value = value;
    applyEffect(value);
  });
};

const updateSlider = () => {
  const effect = Effects[currentEffect];
  const sliderElement = effectLevelSlider.querySelector('.effect-level__slider-element');

  if (sliderElement) {
    sliderElement.min = effect.min;
    sliderElement.max = effect.max;
    sliderElement.step = effect.step;
    sliderElement.value = effect.max;
  }
};

const toggleSliderVisibility = () => {
  if (currentEffect === 'none') {
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
  }
};

const applyEffect = (value) => {
  const effect = Effects[currentEffect];

  if (effect.filter === 'none') {
    imagePreview.style.filter = 'none';
    return;
  }

  imagePreview.style.filter = `${effect.filter}(${value}${effect.unit})`;
};

const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    currentEffect = evt.target.value;
    imagePreview.className = `effects__preview--${currentEffect}`;
    updateSlider();
    toggleSliderVisibility();
    applyEffect(Effects[currentEffect].max);
  }
};

const resetEffects = () => {
  currentEffect = 'none';
  imagePreview.className = 'effects__preview--none';
  imagePreview.style.filter = 'none';
  toggleSliderVisibility();
  effectLevelValue.value = '';

  const noneEffect = document.querySelector('#effect-none');
  if (noneEffect) {
    noneEffect.checked = true;
  }
};

const initEffects = () => {
  effectLevel.classList.add('hidden');
  effectsList.addEventListener('change', onEffectChange);
  initSlider();
  resetEffects();
};

export { initEffects, resetEffects };

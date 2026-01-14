const EFFECTS = {
  none: {
    filter: () => 'none',
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: ''
  },
  chrome: {
    filter: (value) => `grayscale(${value / 100})`,
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: ''
  },
  sepia: {
    filter: (value) => `sepia(${value / 100})`,
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: ''
  },
  marvin: {
    filter: (value) => `invert(${value}%)`,
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: '%'
  },
  phobos: {
    filter: (value) => `blur(${(value * 3) / 100}px)`,
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: 'px'
  },
  heat: {
    filter: (value) => `brightness(${1 + (value * 2) / 100})`,
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    unit: ''
  }
};

const previewImage = document.querySelector('.img-upload__preview img');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsList = document.querySelector('.effects__list');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');

let currentEffect = EFFECTS.none;

noUiSlider.create(effectLevelSlider, {
  range: {
    min: currentEffect.min,
    max: currentEffect.max,
  },
  start: currentEffect.start,
  step: currentEffect.step,
  connect: 'lower',
});

function updateEffect() {
  const value = Number(effectLevelSlider.noUiSlider.get());
  effectLevelValue.value = value;
  previewImage.style.filter = currentEffect.filter(value);
}

function setEffect(effectName) {
  currentEffect = EFFECTS[effectName];

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: currentEffect.min,
      max: currentEffect.max,
    },
    start: currentEffect.start,
    step: currentEffect.step,
  });

  if (effectName === 'none') {
    previewImage.style.filter = 'none';
    effectLevelContainer.classList.add('hidden');
  } else {
    effectLevelContainer.classList.remove('hidden');
    updateEffect();
  }
}

effectLevelSlider.noUiSlider.on('update', () => {
  if (currentEffect === EFFECTS.none) {
    effectLevelValue.value = '';
    return;
  }
  updateEffect();
});

effectsList.addEventListener('change', (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  const effectName = evt.target.value;
  setEffect(effectName);
});

export function resetEffects() {
  setEffect('none');
}

export function initEffects() {
  setEffect('none');
}

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
let slider = null;

const isNoUiSliderAvailable = () => typeof noUiSlider !== 'undefined';

const applyEffect = (value) => {
  const effect = Effects[currentEffect];

  if (effect.filter === 'none') {
    imagePreview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  let formattedValue = value;
  if (effect.unit === '%') {
    formattedValue = `${value}%`;
  } else if (effect.unit === 'px') {
    formattedValue = `${value}px`;
  }

  imagePreview.style.filter = `${effect.filter}(${formattedValue})`;
  effectLevelValue.value = value;
};

const initSlider = () => {
  if (!isNoUiSliderAvailable()) {
    return;
  }

  if (effectLevelSlider) {
    try {
      slider = noUiSlider.create(effectLevelSlider, {
        range: {
          min: 0,
          max: 100,
        },
        start: 100,
        step: 1,
        connect: 'lower',
        format: {
          to: function (value) {
            if (currentEffect === 'chrome' || currentEffect === 'sepia') {
              return value.toFixed(1);
            } else if (currentEffect === 'marvin') {
              return Math.round(value);
            } else if (currentEffect === 'phobos' || currentEffect === 'heat') {
              return value.toFixed(1);
            }
            return value;
          },
          from: function (value) {
            return parseFloat(value);
          },
        },
      });

      slider.on('update', (values, handle) => {
        const value = values[handle];
        effectLevelValue.value = value;
        applyEffect(value);
      });

    } catch (error) {
      // Ошибка при создании noUiSlider
    }
  }
};

const updateSlider = () => {
  if (!slider) {
    return;
  }

  const effect = Effects[currentEffect];

  slider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max,
    },
    step: effect.step,
    start: effect.max,
  });
};

const toggleSliderVisibility = () => {
  if (currentEffect === 'none') {
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
  }
};

const onEffectChange = (evt) => {
  if (evt.target.classList.contains('effects__radio')) {
    currentEffect = evt.target.value;
    imagePreview.className = `effects__preview--${currentEffect}`;

    if (slider) {
      const effect = Effects[currentEffect];
      updateSlider();
      slider.set(effect.max);
      applyEffect(effect.max);
    }

    toggleSliderVisibility();
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

  if (slider) {
    slider.updateOptions({
      range: {
        min: 0,
        max: 100,
      },
      step: 1,
      start: 100,
    });
    slider.set(100);
  }
};

const destroyEffects = () => {
  if (slider) {
    slider.destroy();
    slider = null;
  }
  effectsList.removeEventListener('change', onEffectChange);
};

const initEffects = () => {
  if (!isNoUiSliderAvailable()) {
    effectLevel.classList.add('hidden');
    return;
  }

  effectLevel.classList.add('hidden');

  initSlider();

  effectsList.addEventListener('change', onEffectChange);

  resetEffects();
};

export { initEffects, resetEffects, destroyEffects };

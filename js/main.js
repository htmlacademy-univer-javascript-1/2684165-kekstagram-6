import { similarArray } from './data.js';
import { renderPictures } from './picture-renderer.js';
import { initForm } from './form.js';
import { initScale } from './scale.js';
import { initEffects } from './effects.js';

const initApp = () => {
  renderPictures(similarArray);
  initForm();
  initScale();
  
  if (typeof noUiSlider !== 'undefined') {
    initEffects();
  } else {
    console.error('noUiSlider не загружен. Убедитесь, что библиотека подключена в HTML.');
    const effectLevel = document.querySelector('.effect-level');
    if (effectLevel) {
      effectLevel.classList.add('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', initApp);

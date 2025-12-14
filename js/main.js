import { renderPictures } from './picture-renderer.js';
import { initForm } from './form.js';
import { initScale } from './scale.js';
import { initEffects } from './effects.js';
import { getData } from './api.js';
import { showErrorMessage } from './message.js';
import { initFilters } from './filters.js';

const renderWithClear = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureElements = picturesContainer.querySelectorAll('.picture');

  pictureElements.forEach((element) => {
    element.remove();
  });

  renderPictures(photos);
};

const initApp = () => {
  getData()
    .then((photos) => {
      renderPictures(photos);
      initFilters(photos, renderWithClear);
    })
    .catch((error) => {
      showErrorMessage(error.message);
    });

  initForm();
  initScale();

  if (typeof noUiSlider !== 'undefined') {
    initEffects();
  } else {
    const effectLevel = document.querySelector('.effect-level');
    if (effectLevel) {
      effectLevel.classList.add('hidden');
    }
  }
};

document.addEventListener('DOMContentLoaded', initApp);

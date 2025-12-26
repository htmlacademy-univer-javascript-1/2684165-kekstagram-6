import { renderPictures } from './picture-renderer.js';
import { initForm } from './form.js';
import { initScale } from './scale.js';
import { initEffects } from './effects.js';
import { getData } from './api.js';
import { showErrorMessage } from './message.js';
import { initFilters, updateFilterPhotos } from './filters.js';

let photosData = [];

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
      photosData = photos;
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

const refreshFilters = () => {
  if (photosData.length > 0) {
    updateFilterPhotos(photosData);
  }
};

document.addEventListener('DOMContentLoaded', initApp);

export { refreshFilters };

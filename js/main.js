import './form.js';
import { initFilters } from './filters.js';
import { initScale } from './scale.js';
import { initEffects } from './effects.js';
import { renderPictures } from './pictures.js';
import { load } from './api.js';
import { showLoadError } from './messages.js';

initScale();
initEffects();

load(
  (photos) => {
    renderPictures(photos); // рисуем миниатюры с сервера
    initFilters(photos);
    document
      .querySelector('.img-filters')
      .classList.remove('img-filters--inactive'); // показать фильтры
  },
  (errorMessage) => {
    showLoadError(errorMessage); // сообщение об ошибке загрузки
  }
);

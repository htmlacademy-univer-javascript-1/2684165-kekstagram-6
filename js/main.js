import { similarArray } from './data.js';
import { renderPictures } from './picture-renderer.js';
import { initForm } from './form.js';
import { initScale } from './scale.js';
import { initEffects } from './effects.js';

const initApp = () => {
  renderPictures(similarArray);
  initForm();
  initScale();
  initEffects();
};

document.addEventListener('DOMContentLoaded', initApp);

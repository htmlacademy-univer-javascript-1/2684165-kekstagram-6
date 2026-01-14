import { renderPictures } from './pictures.js';
import { debounce } from './util.js';

const FILTER_RANDOM_COUNT = 10;
const imgFilters = document.querySelector('.img-filters');
const defaultButton = imgFilters.querySelector('#filter-default');
const randomButton = imgFilters.querySelector('#filter-random');
const discussedButton = imgFilters.querySelector('#filter-discussed');

let originalPhotos = [];

function clearPictures() {
  document
    .querySelectorAll('.pictures .picture')
    .forEach((picture) => picture.remove());
}

function setActiveButton(button) {
  imgFilters
    .querySelector('.img-filters__button--active')
    .classList.remove('img-filters__button--active');
  button.classList.add('img-filters__button--active');
}

function getRandomPhotos() {
  return [...originalPhotos]
    .sort(() => Math.random() - 0.5)
    .slice(0, FILTER_RANDOM_COUNT);
}

function getDiscussedPhotos() {
  return [...originalPhotos]
    .sort((a, b) => b.comments.length - a.comments.length);
}

const debouncedRender = debounce((photos) => {
  clearPictures();
  renderPictures(photos);
});

export function initFilters(photos) {
  originalPhotos = photos.slice();

  defaultButton.addEventListener('click', () => {
    setActiveButton(defaultButton);
    debouncedRender(originalPhotos);
  });

  randomButton.addEventListener('click', () => {
    setActiveButton(randomButton);
    debouncedRender(getRandomPhotos());
  });

  discussedButton.addEventListener('click', () => {
    setActiveButton(discussedButton);
    debouncedRender(getDiscussedPhotos());
  });
}

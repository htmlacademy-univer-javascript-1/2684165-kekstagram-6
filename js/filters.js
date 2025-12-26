import { debounce, DEBOUNCE_DELAY, shuffleArray } from './utils.js';

const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');
let currentFilter = 'filter-default';
let currentPhotos = [];
let renderCallback = null;
let debouncedFilterHandler = null;

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const getRandomPhotos = (photos) => {
  const shuffledPhotos = shuffleArray([...photos]);
  return shuffledPhotos.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) =>
  [...photos].sort((a, b) => {
    const aComments = a.comments ? a.comments.length : 0;
    const bComments = b.comments ? b.comments.length : 0;
    return bComments - aComments;
  });

const filterPhotos = (photos, filterType) => {
  switch (filterType) {
    case FilterType.RANDOM:
      return getRandomPhotos(photos);
    case FilterType.DISCUSSED:
      return getDiscussedPhotos(photos);
    case FilterType.DEFAULT:
    default:
      return photos;
  }
};

const onFilterButtonClick = (evt) => {
  const target = evt.target;

  if (!target.matches('.img-filters__button')) {
    return;
  }

  const clickedButton = target;

  if (clickedButton.id === currentFilter) {
    return;
  }

  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  clickedButton.classList.add('img-filters__button--active');

  currentFilter = clickedButton.id;

  const filteredPhotos = filterPhotos(currentPhotos, currentFilter);
  renderCallback(filteredPhotos);
};

const initFilters = (photos, callback) => {
  filtersContainer.classList.remove('img-filters--inactive');

  currentPhotos = photos;
  renderCallback = callback;

  if (debouncedFilterHandler) {
    filtersContainer.removeEventListener('click', debouncedFilterHandler);
  }

  debouncedFilterHandler = debounce(onFilterButtonClick, DEBOUNCE_DELAY);
  filtersContainer.addEventListener('click', debouncedFilterHandler);

  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  const defaultButton = filtersContainer.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }
  currentFilter = 'filter-default';
};

const updateFilterPhotos = (photos) => {
  currentPhotos = photos;
};

export { initFilters, updateFilterPhotos };

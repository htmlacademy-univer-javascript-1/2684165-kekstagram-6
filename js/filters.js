import { debounce, DEBOUNCE_DELAY, shuffleArrayRandomly } from './utils.js';

const RANDOM_PHOTOS_COUNT = 10;

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = filtersContainer.querySelectorAll('.img-filters__button');

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const getRandomPhotos = (photos) => {
  const shuffledPhotos = shuffleArrayRandomly([...photos]);
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

const initFilters = (photos, renderCallback) => {
  filtersContainer.classList.remove('img-filters--inactive');
  
  filterButtons.forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });
  const defaultButton = filtersContainer.querySelector('#filter-default');
  if (defaultButton) {
    defaultButton.classList.add('img-filters__button--active');
  }

  const onFilterButtonClick = (evt) => {
    const target = evt.target;

    if (!target.matches('.img-filters__button')) {
      return;
    }

    const clickedButton = target;

    if (clickedButton.classList.contains('img-filters__button--active')) {
      return;
    }

    filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
    });
    clickedButton.classList.add('img-filters__button--active');

    const filteredPhotos = filterPhotos(photos, clickedButton.id);
    renderCallback(filteredPhotos);
  };

  const debouncedFilterHandler = debounce(onFilterButtonClick, DEBOUNCE_DELAY);
  
  filtersContainer.removeEventListener('click', debouncedFilterHandler);
  
  filtersContainer.addEventListener('click', debouncedFilterHandler);
};

export { initFilters };

const RANDOM_PHOTOS_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersContainer = document.querySelector('.img-filters');
const filterButtons = document.querySelectorAll('.img-filters__button');
let currentFilter = 'filter-default';
let debounceTimeout = null;

const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  return (...rest) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const getRandomPhotos = (photos) => {
  const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
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

const onFilterChange = (callback, photos) => (evt) => {
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

  const filteredPhotos = filterPhotos(photos, currentFilter);
  callback(filteredPhotos);
};

const initFilters = (photos, renderCallback) => {
  filtersContainer.classList.remove('img-filters--inactive');

  const debouncedFilterHandler = debounce(onFilterChange(renderCallback, photos));
  filtersContainer.addEventListener('click', debouncedFilterHandler);
};

export { initFilters };

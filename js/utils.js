const DEBOUNCE_DELAY = 500;

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

const throttle = (callback, delayBetweenFrames = DEBOUNCE_DELAY) => {
  let lastTime = 0;

  return (...args) => {
    const now = new Date();
    if (now - lastTime >= delayBetweenFrames) {
      callback(...args);
      lastTime = now;
    }
  };
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const isEnterKey = (evt) => evt.key === 'Enter';

const safeRemoveEventListener = (element, eventType, handler) => {
  if (element && handler) {
    element.removeEventListener(eventType, handler);
  }
};

const isValidFileType = (file, allowedTypes = ['jpg', 'jpeg', 'png']) => {
  const fileName = file.name.toLowerCase();
  return allowedTypes.some((type) => fileName.endsWith(`.${type}`));
};

const createObjectURL = (file) => {
  if (!file || !URL.createObjectURL) {
    return null;
  }
  return URL.createObjectURL(file);
};

const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:') && URL.revokeObjectURL) {
    URL.revokeObjectURL(url);
  }
};

const toggleElementVisibility = (element, isVisible) => {
  if (!element) {
    return;
  }

  if (isVisible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
};

const smoothScrollToElement = (element, options = {}) => {
  if (!element || !element.scrollIntoView) {
    return;
  }

  const defaultOptions = {
    behavior: 'smooth',
    block: 'center',
    ...options
  };

  element.scrollIntoView(defaultOptions);
};

const cloneTemplate = (templateId) => {
  const template = document.querySelector(`#${templateId}`);
  if (!template) {
    return null;
  }
  return template.content.cloneNode(true);
};

const isElementInViewport = (element) => {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

const getRandomElement = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};

export {
  DEBOUNCE_DELAY,
  debounce,
  throttle,
  isEscapeKey,
  isEnterKey,
  safeRemoveEventListener,
  isValidFileType,
  createObjectURL,
  revokeObjectURL,
  toggleElementVisibility,
  smoothScrollToElement,
  cloneTemplate,
  isElementInViewport,
  getRandomElement,
  shuffleArray,
  formatNumber
};

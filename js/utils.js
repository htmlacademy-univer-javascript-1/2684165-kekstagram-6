const DEBOUNCE_DELAY = 500;

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const isEnterKey = (evt) => evt.key === 'Enter';

const removeEventListenerSafely = (element, eventType, handler) => {
  if (element && handler) {
    element.removeEventListener(eventType, handler);
  }
};

const checkFileType = (file, allowedTypes = ['jpg', 'jpeg', 'png']) => {
  const fileName = file.name.toLowerCase();
  return allowedTypes.some((type) => fileName.endsWith(`.${type}`));
};

const createObjectURLFromFile = (file) => {
  if (!file || !URL.createObjectURL) {
    return null;
  }
  return URL.createObjectURL(file);
};

const revokeObjectURLIfExists = (url) => {
  if (url && url.startsWith('blob:') && URL.revokeObjectURL) {
    URL.revokeObjectURL(url);
  }
};

const scrollToElementSmoothly = (element, options = {}) => {
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

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export {
  DEBOUNCE_DELAY,
  debounce,
  isEscapeKey,
  isEnterKey,
  removeEventListenerSafely,
  checkFileType,
  createObjectURLFromFile,
  revokeObjectURLIfExists,
  scrollToElementSmoothly,
  shuffleArray
};

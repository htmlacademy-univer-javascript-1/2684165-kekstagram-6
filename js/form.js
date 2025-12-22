import { resetScale } from './scale.js';
import { resetEffects, destroyEffects } from './effects.js';
import { sendData } from './api.js';
import { showErrorMessage, showSuccessMessage } from './message.js';
import { 
  isEscapeKey, 
  isValidFileType, 
  createObjectURL, 
  revokeObjectURL,
  smoothScrollToElement 
} from './utils.js';

const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const fileField = document.querySelector('.img-upload__input');
const hashtagField = document.querySelector('.text__hashtags');
const commentField = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');
const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_LENGTH = 20;
const VALID_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const ErrorText = {
  INVALID_COUNT: `Максимум ${MAX_HASHTAG_COUNT} хэштегов`,
  NOT_UNIQUE: 'Хэштеги должны быть уникальными',
  INVALID_PATTERN: 'Неправильный хэштег. Хэштег должен начинаться с #, содержать только буквы и цифры, длина от 1 до 19 символов после #',
  INVALID_HASHTAG: 'Хэштег не может состоять только из решётки',
  INVALID_COMMENT: `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`,
  INVALID_FILE_TYPE: 'Загрузите изображение в формате JPG или PNG',
};

let pristine;

const handleModalEscape = (evt) => {
  if (isEscapeKey(evt) && !overlay.classList.contains('hidden')) {
    evt.preventDefault();
    hideModal();
  }
};

const onCancelButtonClick = () => {
  hideModal();
};

const normalizeTags = (tagString) => tagString
  .trim()
  .split(' ')
  .filter((tag) => Boolean(tag.length));

const hasValidCount = (value) => normalizeTags(value).length <= MAX_HASHTAG_COUNT;

const hasUniqueTags = (value) => {
  const lowerCaseTags = normalizeTags(value).map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};

const hasValidTags = (value) => {
  const tags = normalizeTags(value);
  if (tags.length === 0) {
    return true;
  }

  return tags.every((tag) => {
    if (tag === '#') {
      return false;
    }

    if (tag.length > MAX_HASHTAG_LENGTH) {
      return false;
    }

    return VALID_HASHTAG.test(tag);
  });
};

const hasValidComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const createPreviewUrl = (file) => createObjectURL(file);

const updateImagePreview = (fileUrl) => {
  if (imgPreview) {
    imgPreview.src = fileUrl;
  }

  if (effectsPreviews.length > 0) {
    effectsPreviews.forEach((effectPreview) => {
      if (fileUrl && fileUrl.startsWith('blob:')) {
        effectPreview.style.backgroundImage = `url(${fileUrl})`;
      }
    });
  }
};

const cleanupObjectUrls = () => {
  if (imgPreview && imgPreview.src && imgPreview.src.startsWith('blob:')) {
    revokeObjectURL(imgPreview.src);
  }
};

const hideModal = () => {
  form.reset();
  resetScale();
  resetEffects();
  destroyEffects();

  if (pristine) {
    pristine.reset();
  }

  cleanupObjectUrls();

  if (imgPreview) {
    imgPreview.src = 'img/upload-default-image.jpg';
  }

  if (effectsPreviews.length > 0) {
    effectsPreviews.forEach((effectPreview) => {
      effectPreview.style.backgroundImage = '';
    });
  }

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleModalEscape);

  fileField.value = '';
};

const onFieldFocus = () => {
  document.removeEventListener('keydown', handleModalEscape);
};

const onFieldBlur = () => {
  document.addEventListener('keydown', handleModalEscape);
};

const showModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', handleModalEscape);

  if (pristine) {
    pristine.reset();
  }
};

const setupValidation = () => {
  if (typeof Pristine === 'undefined') {
    return;
  }

  pristine = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper--error',
  });

  pristine.addValidator(
    hashtagField,
    hasValidCount,
    ErrorText.INVALID_COUNT,
    3,
    true
  );

  pristine.addValidator(
    hashtagField,
    hasUniqueTags,
    ErrorText.NOT_UNIQUE,
    2,
    true
  );

  pristine.addValidator(
    hashtagField,
    hasValidTags,
    ErrorText.INVALID_PATTERN,
    1,
    true
  );

  pristine.addValidator(
    commentField,
    hasValidComment,
    ErrorText.INVALID_COMMENT,
    1,
    true
  );
};

const setupLiveValidation = () => {
  hashtagField.addEventListener('input', () => {
    pristine.validate(hashtagField);
  });

  commentField.addEventListener('input', () => {
    pristine.validate(commentField);
  });
};

const setupFieldFocusHandlers = () => {
  hashtagField.addEventListener('focus', onFieldFocus);
  hashtagField.addEventListener('blur', onFieldBlur);
  commentField.addEventListener('focus', onFieldFocus);
  commentField.addEventListener('blur', onFieldBlur);
};

const onFileInputChange = () => {
  const file = fileField.files[0];

  if (!file) {
    return;
  }

  if (!isValidFileType(file, FILE_TYPES)) {
    showErrorMessage(ErrorText.INVALID_FILE_TYPE);
    fileField.value = '';
    return;
  }

  cleanupObjectUrls();

  const fileUrl = createPreviewUrl(file);
  updateImagePreview(fileUrl);
  showModal();
};

let errorOverlay = null;

const handleErrorOverlayEscape = (evt) => {
  if (isEscapeKey(evt)) {
    closeErrorOverlay();
    openUploadForm();
  }
};

const openUploadForm = () => {
  fileField.click();
};

const closeErrorOverlay = () => {
  if (errorOverlay) {
    errorOverlay.remove();
    errorOverlay = null;
  }
  document.removeEventListener('keydown', handleErrorOverlayEscape);
};

const showErrorOverlay = (errorText) => {
  errorOverlay = document.createElement('div');
  errorOverlay.className = 'error-overlay';
  errorOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const errorContent = document.createElement('div');
  errorContent.className = 'error-overlay__content';
  errorContent.style.cssText = `
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
  `;

  errorContent.innerHTML = `
    <h3 style="margin-bottom: 15px; color: #ff6b6b;">Ошибка загрузки</h3>
    <p style="margin-bottom: 20px;">${errorText}</p>
    <button type="button" class="error-overlay__button" style="
      background-color: #ff6b6b;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    ">Загрузить другой файл</button>
  `;

  errorOverlay.appendChild(errorContent);
  document.body.appendChild(errorOverlay);

  document.addEventListener('keydown', handleErrorOverlayEscape);

  errorOverlay.querySelector('.error-overlay__button').addEventListener('click', () => {
    closeErrorOverlay();
    openUploadForm();
  });
  
  errorOverlay.addEventListener('click', (evt) => {
    if (evt.target === errorOverlay) {
      closeErrorOverlay();
      openUploadForm();
    }
  });
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    const firstError = form.querySelector('.img-upload__field-wrapper--error');
    if (firstError) {
      smoothScrollToElement(firstError, { behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    blockSubmitButton();

    const formData = new FormData(form);

    const scaleValue = document.querySelector('.scale__control--value').value;
    const effectLevelValue = document.querySelector('.effect-level__value').value;

    formData.append('scale', scaleValue);
    formData.append('effect-level', effectLevelValue);

    await sendData(formData);

    hideModal();
    setTimeout(() => {
      showSuccessMessage();
    }, 300);

  } catch (error) {
    showErrorOverlay(error.message);
  } finally {
    unblockSubmitButton();
  }
};

const setupEventListeners = () => {
  fileField.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelButtonClick);
  form.addEventListener('submit', onFormSubmit);
};

const initForm = () => {
  setupValidation();
  setupLiveValidation();
  setupFieldFocusHandlers();
  setupEventListeners();
};

export { initForm, hideModal };

import { resetScale } from './scale.js';
import { resetEffects, destroyEffects } from './effects.js';
import { sendData } from './api.js';
import { showErrorMessage, showSuccessMessage } from './message.js';
import { 
  isEscapeKey, 
  checkFileType, 
  createObjectURLFromFile, 
  revokeObjectURLIfExists,
  scrollToElementSmoothly 
} from './utils.js';

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

const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = overlay.querySelector('.img-upload__cancel');
const fileField = form.querySelector('.img-upload__input');
const hashtagField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');
const imgPreview = overlay.querySelector('.img-upload__preview img');
const effectsPreviews = overlay.querySelectorAll('.effects__preview');
const scaleValueElement = overlay.querySelector('.scale__control--value');
const effectLevelValueElement = overlay.querySelector('.effect-level__value');

let pristine;
let documentKeydownHandler = null;

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
    revokeObjectURLIfExists(imgPreview.src);
  }
};

const onFieldFocus = () => {
  if (documentKeydownHandler) {
    document.removeEventListener('keydown', documentKeydownHandler);
  }
};

const onFieldBlur = () => {
  if (documentKeydownHandler) {
    document.addEventListener('keydown', documentKeydownHandler);
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
  
  if (documentKeydownHandler) {
    document.removeEventListener('keydown', documentKeydownHandler);
    documentKeydownHandler = null;
  }

  fileField.value = '';
};

const onCancelButtonClick = () => {
  hideModal();
};

const showModal = () => {
  documentKeydownHandler = (evt) => {
    if (isEscapeKey(evt) && !overlay.classList.contains('hidden')) {
      evt.preventDefault();
      hideModal();
    }
  };

  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', documentKeydownHandler);

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

  if (!checkFileType(file, FILE_TYPES)) {
    showErrorMessage(ErrorText.INVALID_FILE_TYPE, true);
    fileField.value = '';
    return;
  }

  cleanupObjectUrls();

  const fileUrl = createObjectURLFromFile(file);
  updateImagePreview(fileUrl);
  showModal();
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    const firstError = form.querySelector('.img-upload__field-wrapper--error');
    if (firstError) {
      scrollToElementSmoothly(firstError, { behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    blockSubmitButton();

    const formData = new FormData(form);
    formData.append('scale', scaleValueElement.value);
    formData.append('effect-level', effectLevelValueElement.value);

    await sendData(formData);

    hideModal();
    setTimeout(() => {
      showSuccessMessage();
    }, 300);

  } catch (error) {
    showErrorMessage(error.message, false);
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

const openUploadForm = () => {
  fileField.click();
};

export { initForm, hideModal, openUploadForm };

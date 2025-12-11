import { resetScale } from './scale.js';
import { resetEffects, destroyEffects } from './effects.js';
import { sendData } from './api.js';
import { showErrorMessage, showSuccessMessage } from './message.js';

const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const fileField = document.querySelector('.img-upload__input');
const hashtagField = document.querySelector('.text__hashtags');
const commentField = document.querySelector('.text__description');
const submitButton = document.querySelector('.img-upload__submit');

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
  if (tags.length === 0) return true; 

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

const setupValidation = () => {
  if (typeof Pristine === 'undefined') {
    console.error('Pristine not found. Make sure pristine.min.js is loaded before your modules.');
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

const onFieldFocus = () => {
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onFieldBlur = () => {
  document.addEventListener('keydown', onDocumentKeydown);
};

const setupFieldFocusHandlers = () => {
  hashtagField.addEventListener('focus', onFieldFocus);
  hashtagField.addEventListener('blur', onFieldBlur);
  commentField.addEventListener('focus', onFieldFocus);
  commentField.addEventListener('blur', onFieldBlur);
};

const cancelButtonClick = () => {
  hideModal();
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
    evt.preventDefault();
    cancelButtonClick();
  }
};

const showModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  pristine.reset();
};

const hideModal = () => {
  form.reset();
  resetScale();
  resetEffects();
  destroyEffects();
  pristine.reset();

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  fileField.value = '';
};

const fileInputChange = () => {
  const file = fileField.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (!matches) {
    showErrorMessage(ErrorText.INVALID_FILE_TYPE);
    fileField.value = '';
    return;
  }

  showModal();

  const preview = document.querySelector('.img-upload__preview img');
  preview.src = URL.createObjectURL(file);
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (!isValid) {
    console.log('Форма содержит ошибки валидации');
    const firstError = form.querySelector('.img-upload__field-wrapper--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  fileField.addEventListener('change', fileInputChange);
  cancelButton.addEventListener('click', cancelButtonClick);
  form.addEventListener('submit', onFormSubmit);
};

const initForm = () => {
  setupValidation();
  setupLiveValidation();
  setupFieldFocusHandlers();
  setupEventListeners();
};

export { initForm, hideModal };

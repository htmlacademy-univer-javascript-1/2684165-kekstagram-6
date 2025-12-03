import { resetScale } from './scale.js';
import { resetEffects } from './effects.js';

const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const fileField = document.querySelector('.img-upload__input');
const hashtagField = document.querySelector('.text__hashtags');
const commentField = document.querySelector('.text__description');

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const MAX_HASHTAG_LENGTH = 20;
const VALID_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;

const ErrorText = {
  INVALID_COUNT: `Максимум ${MAX_HASHTAG_COUNT} хэштегов`,
  NOT_UNIQUE: 'Хэштеги должны быть уникальными',
  INVALID_PATTERN: 'Неправильный хэштег. Хэштег должен начинаться с #, содержать только буквы и цифры, длина от 1 до 19 символов после #',
  INVALID_HASHTAG: 'Хэштег не может состоять только из решётки',
  INVALID_COMMENT: `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
};

if (typeof Pristine === 'undefined') {
  console.error('Pristine not found. Make sure pristine.min.js is loaded before your modules.');
}

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

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

const onFieldFocus = () => {
  document.removeEventListener('keydown', onDocumentKeydown);
};

const onFieldBlur = () => {
  document.addEventListener('keydown', onDocumentKeydown);
};

hashtagField.addEventListener('focus', onFieldFocus);
hashtagField.addEventListener('blur', onFieldBlur);
commentField.addEventListener('focus', onFieldFocus);
commentField.addEventListener('blur', onFieldBlur);

const onCancelButtonClick = () => {
  hideModal();
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
    evt.preventDefault();
    onCancelButtonClick();
  }
}

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
  pristine.reset();

  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  
  fileField.value = '';
};

const onFileInputChange = () => {
  showModal();
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();

  if (isValid) {
    console.log('Форма валидна, отправляем данные на сервер');

    const formData = new FormData(form);

    const scaleValue = document.querySelector('.scale__control--value').value;
    const effectLevelValue = document.querySelector('.effect-level__value').value;

    formData.append('scale', scaleValue);
    formData.append('effect-level', effectLevelValue);

    console.log('Данные формы:', {
      scale: scaleValue,
      effectLevel: effectLevelValue,
      hashtags: hashtagField.value,
      description: commentField.value
    });

    hideModal();
  } else {
    console.log('Форма содержит ошибки валидации');
    const firstError = form.querySelector('.img-upload__field-wrapper--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

const setupLiveValidation = () => {
  hashtagField.addEventListener('input', () => {
    pristine.validate(hashtagField);
  });

  commentField.addEventListener('input', () => {
    pristine.validate(commentField);
  });
};

const initForm = () => {
  fileField.addEventListener('change', onFileInputChange);
  cancelButton.addEventListener('click', onCancelButtonClick);
  form.addEventListener('submit', onFormSubmit);
  setupLiveValidation();
};

export { initForm, hideModal };

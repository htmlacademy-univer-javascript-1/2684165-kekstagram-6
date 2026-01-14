import { send } from './api.js';
import { resetEffects } from './effects.js';
import { showSuccess, showError } from './messages.js';

const form = document.querySelector('.img-upload__form');
const fileInput = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const body = document.body;

const hashtagsField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');

const previewImage = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

function openUploadOverlay() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function resetForm() {
  form.reset();
  fileInput.value = '';
  resetEffects();
}

export function closeUploadOverlay() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  resetForm();
}

const submitButton = form.querySelector('.img-upload__submit');

function blockSubmitButton() {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
}

function unblockSubmitButton() {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
}

function isTextFieldFocused() {
  return document.activeElement === hashtagsField || document.activeElement === commentField;
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    if (isTextFieldFocused()) {
      evt.stopPropagation();
      return;
    }
    evt.preventDefault();
    closeUploadOverlay();
  }
}

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((ext) => fileName.endsWith(ext));

  if (!matches) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const dataUrl = reader.result;
    previewImage.src = dataUrl;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url(${dataUrl})`;
    });
  });

  reader.readAsDataURL(file);
  openUploadOverlay();
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeUploadOverlay();
});

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'img-upload__error'
}, false);

function parseHashtags(value) {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);
}

const HASHTAG_MAX_COUNT = 5;
const HASHTAG_REGEXP = /^#[a-zа-яё0-9]{1,19}$/i;

function validateHashtagFormat(value) {
  if (!value.trim()) {
    return true;
  }

  const tags = parseHashtags(value);
  return tags.every((tag) => HASHTAG_REGEXP.test(tag));
}

function validateHashtagCount(value) {
  const tags = parseHashtags(value);
  return tags.length <= HASHTAG_MAX_COUNT;
}

function validateHashtagUnique(value) {
  const tags = parseHashtags(value);
  const unique = new Set(tags);
  return unique.size === tags.length;
}

function getHashtagErrorMessage(value) {
  const tags = parseHashtags(value);

  if (!value.trim()) {
    return '';
  }

  if (!tags.every((tag) => HASHTAG_REGEXP.test(tag))) {
    return 'Неверный формат хэш-тега';
  }

  if (tags.length > HASHTAG_MAX_COUNT) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  const unique = new Set(tags);
  if (unique.size !== tags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
}

pristine.addValidator(
  hashtagsField,
  (value) => validateHashtagFormat(value) && validateHashtagCount(value) && validateHashtagUnique(value),
  getHashtagErrorMessage
);

const COMMENT_MAX_LENGTH = 140;

function validateComment(value) {
  return value.length <= COMMENT_MAX_LENGTH;
}

function getCommentErrorMessage(value) {
  if (!validateComment(value)) {
    return 'Комментарий не может быть длиннее 140 символов';
  }
  return '';
}

pristine.addValidator(
  commentField,
  validateComment,
  getCommentErrorMessage
);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }

  blockSubmitButton();

  const formData = new FormData(form);

  send(
    formData,
    () => {
      unblockSubmitButton();
      closeUploadOverlay();
      showSuccess();
    },
    () => {
      unblockSubmitButton();
      showError();
    }
  );
});

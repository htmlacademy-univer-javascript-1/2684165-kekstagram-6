import { openUploadForm } from './form.js';

const messageTemplate = document.querySelector('#error').content.querySelector('.error');
const successTemplate = document.querySelector('#success').content.querySelector('.success');

const showMessage = (template, buttonClass, closeCallback = null, extraCallback = null) => {
  const messageElement = template.cloneNode(true);
  const messageButton = messageElement.querySelector(buttonClass);

  const closeMessage = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onOutsideClick);

    if (typeof closeCallback === 'function') {
      closeCallback();
    }
  };

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
      if (typeof extraCallback === 'function') {
        extraCallback();
      }
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest(`.${template.classList[0]}__inner`)) {
      closeMessage();
      if (typeof extraCallback === 'function') {
        extraCallback();
      }
    }
  };

  const onMessageClick = (evt) => {
    if (!evt.target.closest(`.${template.classList[0]}__inner`)) {
      closeMessage();
      if (typeof extraCallback === 'function') {
        extraCallback();
      }
    }
  };

  messageButton.addEventListener('click', () => {
    closeMessage();
    if (typeof extraCallback === 'function') {
      extraCallback();
    }
  });

  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onDocumentKeydown);

  setTimeout(() => {
    document.addEventListener('click', onOutsideClick);
  }, 100);

  document.body.appendChild(messageElement);

  messageButton.focus();
};

const hideModal = () => {
  const overlay = document.querySelector('.img-upload__overlay');
  if (overlay && !overlay.classList.contains('hidden')) {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
};

const showErrorMessage = (text = 'Не удалось загрузить данные. Попробуйте обновить страницу', hideForm = true) => {
  const template = messageTemplate.cloneNode(true);
  template.querySelector('.error__title').textContent = text;

  if (text.includes('JPG') || text.includes('PNG') || text.includes('формат')) {
    const errorButton = template.querySelector('.error__button');
    errorButton.textContent = 'Загрузить другой файл';
    
    if (hideForm) {
      const closeFormCallback = () => {
        hideModal();
      };
      showMessage(template, '.error__button', closeFormCallback, openUploadForm);
    } else {
      showMessage(template, '.error__button', null, openUploadForm);
    }
  } else {
    if (hideForm) {
      const closeFormCallback = () => {
        hideModal();
      };
      showMessage(template, '.error__button', closeFormCallback);
    } else {
      showMessage(template, '.error__button');
    }
  }
};

const showSuccessMessage = () => {
  const template = successTemplate.cloneNode(true);

  const closeFormCallback = () => {
    hideModal();
  };

  showMessage(template, '.success__button', closeFormCallback);
};

export { showErrorMessage, showSuccessMessage };

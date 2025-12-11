const messageTemplate = document.querySelector('#error').content.querySelector('.error');
const successTemplate = document.querySelector('#success').content.querySelector('.success');

const showMessage = (template, buttonClass, closeCallback = null) => {
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
    }
  };

  const onOutsideClick = (evt) => {
    if (!evt.target.closest(`.${template.classList[0]}__inner`)) {
      closeMessage();
    }
  };

  const onMessageClick = (evt) => {
    if (!evt.target.closest(`.${template.classList[0]}__inner`)) {
      closeMessage();
    }
  };

  messageButton.addEventListener('click', closeMessage);
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

  if (hideForm) {
    const closeFormCallback = () => {
      hideModal();
    };
    showMessage(template, '.error__button', closeFormCallback);
  } else {
    showMessage(template, '.error__button');
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

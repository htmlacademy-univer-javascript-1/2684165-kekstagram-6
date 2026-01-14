const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

function appendMessage(element) {
  document.body.appendChild(element);
}


function setupMessage(messageElement, buttonSelector, closeCallback) {
  const inner = messageElement.querySelector('div');
  const button = messageElement.querySelector(buttonSelector);

  const onKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      close();
    }
  };

  const onOuterClick = (evt) => {
    if (!inner.contains(evt.target)) {
      close();
    }
  };

  function close() {
    messageElement.remove();
    document.removeEventListener('keydown', onKeydown);
    messageElement.removeEventListener('click', onOuterClick);
    if (closeCallback) {
      closeCallback();
    }
  }

  button.addEventListener('click', (evt) => {
    evt.preventDefault();
    close();
  });

  document.addEventListener('keydown', onKeydown);
  messageElement.addEventListener('click', onOuterClick);
}

export function showSuccess() {
  const successElement = successTemplate.cloneNode(true);
  appendMessage(successElement);
  setupMessage(successElement, '.success__button');
}

export function showError() {
  const errorElement = errorTemplate.cloneNode(true);
  appendMessage(errorElement);
  setupMessage(errorElement, '.error__button');
}

export function showLoadError(message) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.right = '0';
  container.style.zIndex = '1000';
  container.style.padding = '10px';
  container.style.textAlign = 'center';
  container.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
  container.style.color = '#ffffff';
  container.style.fontSize = '16px';
  container.textContent = message;

  document.body.appendChild(container);

  setTimeout(() => {
    container.remove();
  }, 5000);
}

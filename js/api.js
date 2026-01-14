const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};
const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте обновить страницу.',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз.',
};

function load(onSuccess, onFail) {
  fetch(`${BASE_URL}${Route.GET_DATA}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(onSuccess)
    .catch(() => {
      onFail(ErrorText.GET_DATA);
    });
}

function send(formData, onSuccess, onFail) {
  fetch(`${BASE_URL}${Route.SEND_DATA}`, {
    method: Method.POST,
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      onSuccess();
    })
    .catch(() => {
      onFail(ErrorText.SEND_DATA);
    });
}

export { load, send };

const COMMENTS_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const commentsList = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsCounter = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

const body = document.body;

let currentComments = [];
let shownCommentsCount = 0;

function createCommentElement(comment) {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.width = 35;
  img.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  li.appendChild(img);
  li.appendChild(text);

  return li;
}

function updateCommentsCounter() {
  const total = currentComments.length;
  commentsCounter.textContent = `Показано ${shownCommentsCount} из ${total} комментариев`;
}

function renderCommentsPortion() {
  const fragment = document.createDocumentFragment();

  const nextCount = Math.min(shownCommentsCount + COMMENTS_STEP, currentComments.length);

  for (let i = shownCommentsCount; i < nextCount; i++) {
    const commentElement = createCommentElement(currentComments[i]);
    fragment.appendChild(commentElement);
  }

  commentsList.appendChild(fragment);
  shownCommentsCount = nextCount;
  updateCommentsCounter();

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function onEscKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

export function openBigPicture(photo) {
  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  // готовим комментарии
  commentsList.innerHTML = '';
  currentComments = photo.comments.slice();
  shownCommentsCount = 0;

  if (currentComments.length === 0) {
    commentsCounter.textContent = 'Показано 0 из 0 комментариев';
    commentsLoader.classList.add('hidden');
  } else {
    renderCommentsPortion();
  }

  // показываем счётчик и кнопку (если есть ещё комментарии)
  commentsCounter.classList.remove('hidden');

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onEscKeydown);
}

export function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeydown);
}

// закрытие по крестику
closeButton.addEventListener('click', () => {
  closeBigPicture();
});

// загрузка ещё комментариев
commentsLoader.addEventListener('click', (evt) => {
  evt.preventDefault();
  renderCommentsPortion();
});

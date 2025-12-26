import { isEscapeKey } from './utils.js';

const COMMENTS_PER_STEP = 5;

const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');

let currentComments = [];
let commentsShown = 0;
let documentKeydownHandler = null;

const createComment = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

const renderCommentsPortion = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_STEP);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach((comment) => {
    fragment.appendChild(createComment(comment));
  });

  socialComments.appendChild(fragment);
  commentsShown += commentsToShow.length;

  const commentCountText = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;
  commentCount.innerHTML = commentCountText;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const loadMoreComments = () => {
  renderCommentsPortion();
};

const resetComments = () => {
  currentComments = [];
  commentsShown = 0;
  socialComments.innerHTML = '';
};

const renderComments = (comments) => {
  resetComments();
  currentComments = comments;
  renderCommentsPortion();
};

const closeFullscreenPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetComments();
  
  if (documentKeydownHandler) {
    document.removeEventListener('keydown', documentKeydownHandler);
    documentKeydownHandler = null;
  }
};

const openFullscreenPicture = (pictureData) => {
  const { url, description, likes, comments } = pictureData;

  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentsCount.textContent = comments.length;
  socialCaption.textContent = description;

  renderComments(comments);

  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  
  documentKeydownHandler = (evt) => {
    if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
      closeFullscreenPicture();
    }
  };
  
  document.addEventListener('keydown', documentKeydownHandler);
};

const onCloseButtonClick = () => {
  closeFullscreenPicture();
};

commentsLoader.addEventListener('click', loadMoreComments);
closeButton.addEventListener('click', onCloseButtonClick);

export { openFullscreenPicture };

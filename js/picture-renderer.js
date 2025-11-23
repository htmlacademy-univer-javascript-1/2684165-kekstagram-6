import { openFullscreenPicture } from './fullscreen-picture.js';

const renderPictures = (pictures) => {
  const pictureTemplate = document.querySelector('#picture');
  const picturesContainer = document.querySelector('.pictures');

  if (!pictureTemplate || !picturesContainer) {
    console.error('Шаблон #picture или контейнер .pictures не найден');
    return;
  }

  const fragment = document.createDocumentFragment();

  pictures.forEach((pictureData) => {
    const { url, description, likes, comments } = pictureData;
    const pictureElement = pictureTemplate.content.cloneNode(true).children[0];

    const img = pictureElement.querySelector('.picture__img');
    if (img) {
      img.src = url;
      img.alt = description;
    }

    const likesElement = pictureElement.querySelector('.picture__likes');
    if (likesElement) {
      likesElement.textContent = likes;
    }

    const commentsElement = pictureElement.querySelector('.picture__comments');
    if (commentsElement) {
      commentsElement.textContent = Array.isArray(comments) ? comments.length : comments;
    }

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullscreenPicture(pictureData);
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

export { renderPictures }
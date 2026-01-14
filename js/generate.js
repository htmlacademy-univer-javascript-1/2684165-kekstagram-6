import { DESCRIPTIONS, NAMES, MESSAGES } from './data.js';
import { getRandomInt, getRandomArrayElement } from './util.js';

// Генерация текста комментария из 1–2 случайных предложений
function generateMessage() {
  const count = getRandomInt(1, 2);
  const shuffled = [...MESSAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(' ');
}

function generateComment(id) {
  return {
    id,
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: generateMessage(),
    name: getRandomArrayElement(NAMES)
  };
}

function generateComments() {
  const comments = [];
  const count = getRandomInt(0, 30);

  for (let i = 0; i < count; i++) {
    comments.push(generateComment(Date.now() + i + Math.random()));
  }

  return comments;
}

function generatePhoto(id) {
  return {
    id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInt(15, 200),
    comments: generateComments()
  };
}

export function generatePhotos() {
  const photos = [];
  for (let i = 1; i <= 25; i++) {
    photos.push(generatePhoto(i));
  }
  return photos;
}

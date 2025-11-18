const NAMES = [
    'Артем',
    'Влад',
    'Жанна',
    'Лера',
    'Олег',
];
const COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];
const COUNT_OBJECTS = 25;

function getRandomInteger (a, b) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

function createRandomIdFromRangeGenerator (min, max) {
  const previousValues = [];

  return function () {
    let currentValue = getRandomInteger(min, max);
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(min, max);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

const createComments = () => ({
    id: createRandomIdFromRangeGenerator(10, 500)(),
    avatar: `img/avatar-${createRandomIdFromRangeGenerator(1, 6)()}.svg`,
    message: COMMENTS[getRandomInteger(0, COMMENTS.length - 1)],
    name: NAMES[getRandomInteger(0, NAMES.length - 1)],
});

const similarComments = Array.from({length: getRandomInteger(0, 30)}, createComments);

const createArray = () => ({
    id: createRandomIdFromRangeGenerator(1, 25)(),
    url: `photos/${createRandomIdFromRangeGenerator(1, 25)()}.jpg`,
    description: 'Лучшая картинка',
    likes: createRandomIdFromRangeGenerator(15, 200)(),
    comments: similarComments,

});

const similarArray = Array.from({length: COUNT_OBJECTS}, createArray);

console.dir(similarArray, { depth: null, colors: true });

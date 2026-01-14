const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const DEFAULT_SCALE = 100;

const smallerButton = document.querySelector('.scale__control--smaller');
const biggerButton = document.querySelector('.scale__control--bigger');
const scaleValue = document.querySelector('.scale__control--value');
const previewImage = document.querySelector('.img-upload__preview img');

let currentScale = DEFAULT_SCALE;

function setScale(value) {
  currentScale = value;
  scaleValue.value = `${currentScale}%`;
  const ratio = currentScale / 100;
  previewImage.style.transform = `scale(${ratio})`;
}

function onSmallerClick() {
  const newValue = Math.max(SCALE_MIN, currentScale - SCALE_STEP);
  setScale(newValue);
}

function onBiggerClick() {
  const newValue = Math.min(SCALE_MAX, currentScale + SCALE_STEP);
  setScale(newValue);
}

export function resetScale() {
  setScale(DEFAULT_SCALE);
}

export function initScale() {
  setScale(DEFAULT_SCALE);
  smallerButton.addEventListener('click', onSmallerClick);
  biggerButton.addEventListener('click', onBiggerClick);
}

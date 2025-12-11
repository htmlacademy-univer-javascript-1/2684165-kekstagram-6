const scaleControl = document.querySelector('.scale__control--value');
const scaleSmaller = document.querySelector('.scale__control--smaller');
const scaleBigger = document.querySelector('.scale__control--bigger');
const imagePreview = document.querySelector('.img-upload__preview img');

const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100,
};

let currentScale = Scale.DEFAULT;

const updateScaleDisplay = () => {
  scaleControl.value = `${currentScale}%`;
  scaleControl.setAttribute('value', `${currentScale}%`);

  imagePreview.style.transform = `scale(${currentScale / 100})`;
};

const scaleDownClick = () => {
  if (currentScale > Scale.MIN) {
    currentScale -= Scale.STEP;
    updateScaleDisplay();
  }
};

const onScaleUpClick = () => {
  if (currentScale < Scale.MAX) {
    currentScale += Scale.STEP;
    updateScaleDisplay();
  }
};

const resetScale = () => {
  currentScale = Scale.DEFAULT;
  updateScaleDisplay();
};

const initScale = () => {
  scaleSmaller.addEventListener('click', scaleDownClick);
  scaleBigger.addEventListener('click', onScaleUpClick);

  resetScale();
};

export { initScale, resetScale };

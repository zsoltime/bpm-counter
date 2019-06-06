const BPMCounter = (initialSettings = {}) => {
  const dom = {};
  const { precision = 1, resetTime = 2 } = initialSettings;
  const settings = {
    resetTime,
    precision,
  };
  let count = 0;
  let firstTapTime = 0;
  let previousTapTime = 0;

  const init = () => {
    cacheDOM();
    bindEvents();
    dom.btn.focus();
  };

  const cacheDOM = () => {
    dom.avg = document.getElementById('avg');
    dom.bpm = document.querySelector('.bpm');
    dom.btn = document.getElementById('btn');
    dom.taps = document.getElementById('taps');
  };

  const bindEvents = () => {
    dom.bpm.addEventListener('transitionend', () => {
      dom.bpm.classList.remove('bpm--tapped');
    });
    dom.btn.addEventListener('click', calculateBPM);
  };

  const resetCounter = () => {
    dom.avg.textContent = 0;
    dom.taps.textContent = 0;
  };

  const calculateBPM = () => {
    const currentTime = new Date().getTime();

    dom.bpm.classList.add('bpm--tapped');

    if (currentTime - previousTapTime > settings.resetTime * 1000) {
      count = 0;
    }

    if (count === 0) {
      firstTapTime = currentTime;
      count += 1;

      dom.avg.textContent = 0;
      dom.taps.textContent = count;
    } else {
      const avgBPM =
        (count * 60 * 1000) / (currentTime - firstTapTime);

      count += 1;

      dom.avg.textContent = avgBPM.toFixed(settings.precision);
      dom.taps.textContent = count;
    }

    previousTapTime = currentTime;
  };

  return { init };
};

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./serviceWorker.js');
    } catch (e) {
      console.error('Service worker registration failed', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const counter = BPMCounter();
  counter.init();
  registerSW();
});

'use strict';

window.addEventListener('load', () => {
  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', () => (
    window.location.href = playButton.getAttribute('data-href')
  ));
});

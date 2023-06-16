'use strict';

window.addEventListener('load', () => {
  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener('click', () => (
    window.location.href = homeButton.getAttribute('data-href')
  ));

  const level1Button = document.getElementById('level1Button');
  level1Button.addEventListener('click', () => {
    localStorage.setItem('levelIndex', '0');
    window.location.href = level1Button.getAttribute('data-href');
  });
});

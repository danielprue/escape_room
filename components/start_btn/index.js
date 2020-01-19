$(document).ready(document.querySelector('.menu').append(Start()));

function Start() {
    const startBtn = document.createElement('div');
    startBtn.textContent = 'START';
    startBtn.classList = 'start-btn';
    startBtn.addEventListener('click', control.createRoom);
    return startBtn;
}

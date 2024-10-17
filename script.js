let idNumber = 0
const logElement = document.getElementById('log');

const regexp = /(?<=<body.*?>)./si

const str =
    `<html>
        <body style="height: 200px">
            ...
        </body> 
    </html>`;
log(str.replace(regexp, '<h1>Hello World!</h1>'));
log(str.replace(regexp, '<h1>Hello World!</h1>'));


log(str.replace(regexp, '<h1>Hello World!</h1>'));


function log(value) {
    const logBody = document.createElement('div')
    const logView = document.createElement('pre');
    const logoDate = document.createElement('p');
    const logId = document.createElement('p');
    const logClearBoth = document.createElement('div');
    const logClose = document.createElement('div');
    const logWrapper = document.createElement('div');
    const date = new Date();

    logBody.classList.add('log-body');
    logView.classList.add('log-view');
    logoDate.classList.add('log-date', 'log-bottom');
    logId.classList.add('log-id', 'log-bottom');
    logClose.classList.add('log-close');
    logWrapper.classList.add('log-wrapper', 'open');
    logClearBoth.classList.add('log-clear');

    logView.textContent = value;
    logId.textContent = `id:${date.getTime() + idNumber}`;
    idNumber++;
    logClose.innerHTML = '<span>x</span>'
    logoDate.textContent = `${date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()}`;

    const cloneLogClearBoth = logClearBoth.cloneNode(true);
    logElement.append(logWrapper)
    logWrapper.append(logBody);
    logBody.append(logView)
    logBody.append(cloneLogClearBoth);
    logBody.append(logId);
    logBody.append(logoDate);
    logBody.append(logClearBoth);
    logBody.append(logClose);

    logClose.addEventListener('click', close)

}

function close(e) {
    const target = e.target.closest('.log-wrapper');
    target.classList.add('is-deleting');
    e.target.closest('.log-body').classList.add('is-deleting');
    setTimeout(() => target.remove(), 500)

}

const addLog = document.querySelector('.add-log');
const logInput = document.getElementById('log-input');

addLog.addEventListener('click', () => {
    if (logInput.value) log(logInput.value)
    else log('test')
});

document.addEventListener('dragstart', e => e.preventDefault())

document.addEventListener('pointerdown', function (e) {
    const target = e.target.closest('.log-wrapper');
    if(!target) return
    target.style.position = 'absolute';


    moveAt(e.pageX, e.pageY, target);

    target.addEventListener('pointermove', onMouseMove);
    target.addEventListener('pointerup', onMouseUp)

    function onMouseUp(){
        target.removeEventListener('pointermove', onMouseMove);
        target.removeEventListener('pointerup', onMouseUp)
    }

    function moveAt(pageX, pageY) {
        target.style.left = pageX - target.offsetWidth / 2 + 'px';
        target.style.top = pageY - target.offsetHeight / 2 + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }


})



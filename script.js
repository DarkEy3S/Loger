let idNumber = 0
const logElement = document.getElementById('log');
let currentDroppable = null;

const regexp = /(?<=<body.*?>)./si

const str =
    `<html>
        <body style="height: 200px">
            ...
        </body> 
    </html>`;
log('1');
log('2');


log('3');


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
    logWrapper.classList.add('log-wrapper', 'open', 'droppable');
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


}



const addLog = document.querySelector('.add-log');
const logInput = document.getElementById('log-input');

addLog.addEventListener('click', () => {
    if (logInput.value) log(logInput.value)
    else log('test')
});

logElement.addEventListener('dragstart', e => e.preventDefault())

document.addEventListener('pointerdown', onPointerDown);

function onPointerDown(e) {
    let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    let droppableBelow

    const target = e.target.closest('.log-wrapper');
    if (!target) return;
    const buffDiv = document.createElement('div');
    target.classList.remove('droppable');
    buffDiv.style.height = target.offsetHeight + 'px';
    buffDiv.style.width = target.offsetWidth + 'px';
    buffDiv.classList.add('log-wrapper')
    console.log(target.style.marginBottom)
    target.after(buffDiv);
    target.style.position = "absolute";
    target.style.zIndex = "1000";
    target.style.cursor = "grabbing";
    let cords = getCoords(target)

    let shiftX = e.clientX - cords.left;
    let shiftY = e.clientY - cords.top;


    moveAt(e.pageX, e.pageY);


    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', onMouseUp)


    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);


    }

    function onMouseUp() {
        document.removeEventListener('pointermove', onMouseMove);
        document.removeEventListener('pointerup', onMouseUp)
        buffDiv.remove()
        target.style.cursor = '';
        target.style.zIndex = '';
        target.style.position = '';
        target.style.left = '';
        target.style.top = '';


        target.hidden = true;
        elemBelow = document.elementFromPoint(event.pageX, event.pageY);
        if (elemBelow.closest('.droppable')) {

            console.log(elemBelow);
        }

        target.hidden = false;


        if (!elemBelow) return


        droppableBelow = elemBelow.closest('.droppable');
        drop(droppableBelow)

        target.classList.add('droppable');

    }

    function moveAt(pageX, pageY) {
        let left = pageX - logElement.offsetLeft - shiftX;
        let top = pageY - logElement.offsetTop - shiftY;


        if (left < 0) {
            left = 0;
        } else if (left + target.offsetWidth > logElement.offsetWidth) {
            left = logElement.offsetWidth - target.offsetWidth;
        }
        if (top < 0) {
            top = 0;
        } else if (top + target.offsetHeight > logElement.offsetHeight) {
            top = logElement.offsetHeight - target.offsetHeight;
        }


        target.style.left = left + 'px';
        target.style.top = top + 'px';
    }

    function drop(element) {
        if (!element) return;
        enterDroppable(element);


    }


    function enterDroppable(elem) {
        let cloneDrop = elem.cloneNode(true);
        let cloneMain = target.cloneNode(true);

        cloneMain.classList.add('droppable');
        elem.after(cloneMain);
        target.after(cloneDrop);
        elem.remove();
        target.remove()

    }


}

// получаем координаты элемента в контексте документа
function getCoords(elem) {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + window.scrollY,
        right: box.right + window.scrollX,
        bottom: box.bottom + window.scrollY,
        left: box.left + window.scrollX
    };
}

document.addEventListener('click', e => {

    let logClose = e.target.closest('.log-close');
    if (!logClose) return;
    const target = e.target.closest('.log-wrapper');



    console.log(logClose);
    target.classList.add('is-deleting');

    e.target.closest('.log-body').classList.add('is-deleting');
    setTimeout(() => target.remove(), 500)

})

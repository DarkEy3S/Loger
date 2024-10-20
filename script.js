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

let keys = Object.keys(localStorage);

keys = keys.sort((a, b) => +a.match(/\d+/g) > +b.match(/\d+/g) ? 1 : -1);

if(keys[0]) idNumber = keys[keys.length - 1].match(/\d+/);
for (const key of keys) {

    logElement.insertAdjacentHTML('afterbegin', localStorage.getItem(key))
}


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
    idNumber++;

    logId.textContent = `id:${idNumber}`;

    logClose.innerHTML = '<span>x</span>'
    logoDate.textContent = `${date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()}`;

    const cloneLogClearBoth = logClearBoth.cloneNode(true);
    logElement.prepend(logWrapper)
    logWrapper.append(logBody);
    logBody.append(logView)
    logBody.append(cloneLogClearBoth);
    logBody.append(logId);
    logBody.append(logoDate);
    logBody.append(logClearBoth);
    logBody.append(logClose);

    localStorage.setItem(logId.textContent, logWrapper.outerHTML);

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
    let scrollTop ;
    let scrollLeft ;
    const target = e.target.closest('.log-wrapper');
    if (!target) return;
    const buffDiv = document.createElement('div');
    target.classList.remove('droppable');
    buffDiv.style.height = target.clientHeight + 'px';
    buffDiv.style.width = target.clientWidth + 'px';
    buffDiv.classList.add('log-wrapper')
    target.after(buffDiv);
    target.style.position = "absolute";
    target.style.zIndex = "1000";
    target.style.cursor = "grabbing";
    let cords = getCoords(target)

    let shiftX = e.clientX - cords.left;
    let shiftY = e.clientY - cords.top;

    scrollTop = scrollY
    scrollLeft = scrollX;

    moveAt(e.clientX, e.clientY);


    document.addEventListener('pointermove', onMouseMove);
    document.addEventListener('pointerup', onMouseUp)


    function onMouseMove(e) {
        moveAt(e.pageX, e.clientY);



    }

    function onMouseUp(e) {
        document.removeEventListener('pointermove', onMouseMove);
        document.removeEventListener('pointerup', onMouseUp)
        buffDiv.remove()
        target.style.cursor = '';
        target.style.zIndex = '';
        target.style.position = '';
        target.style.left = '';
        target.style.top = '';


        target.hidden = true;
        elemBelow = document.elementFromPoint(e.clientX, e.clientY);

        target.hidden = false;


        if (!elemBelow) return


        droppableBelow = elemBelow.closest('.droppable');
        drop(droppableBelow)

        target.classList.add('droppable');

    }

    function moveAt(pageX, pageY) {


        let left = pageX  - logElement.offsetLeft  - shiftX - (scrollLeft - scrollX);
        let top = pageY   - logElement.offsetTop  - shiftY - (scrollTop - scrollY);



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
        target.style.top = top  + 'px';
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
    let id = target.querySelector('.log-id')
    localStorage.removeItem(id.innerHTML)

    target.classList.add('is-deleting');

    e.target.closest('.log-body').classList.add('is-deleting');
    setTimeout(() => target.remove(), 500)

})

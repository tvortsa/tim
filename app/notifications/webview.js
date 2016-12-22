const ipc = require('electron').ipcRenderer;
const msg = ipc.sendToHost;


function injectCss (ev, css) {
	const style = document.createElement('style');
	style.innerHTML = css;
	document.head.appendChild(style);
}


function reload () {
	document.querySelector('.filter-list .filter-item.selected').click();
}


function onClick (e) {
	const el = e.target;
	if (el.matches('.notifications-list .js-navigation-open')) {
		e.preventDefault();
		msg('goto', el.href);
	}
}


function init () {
	const aid = document.querySelector('.accessibility-aid');
	if (aid) aid.remove();


	document.addEventListener('click', onClick, true);
	ipc.on('reload', reload);
	ipc.on('injectCss', injectCss);

	msg('docReady');
}


document.addEventListener('DOMContentLoaded', init);

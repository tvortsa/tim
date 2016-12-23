const {shell, clipboard} = require('electron');
const $ = require('../util');
const Config = require('electron-config');
const config = new Config();


let isReady = false, el, starBox, notifToggle, btnBack, btnForw;

const clickHandlers = {
	prev () { $.trigger('frame/goto', 'prev'); },
	next () { $.trigger('frame/goto', 'next'); },
	refresh () { $.trigger('frame/goto', 'refresh'); },
	stop () { $.trigger('frame/goto', 'stop'); },
	browser () { shell.openExternal(config.get('state.url')); },
	copy () { clipboard.writeText(config.get('state.url')); },
	star () { $.trigger('issue/star', config.get('state.issue')); starBox.addClass('is-starred'); },
	unstar () { $.trigger('issue/unstar', config.get('state.issue')); starBox.removeClass('is-starred'); },
	hideNotifications () { $.trigger('toggle-notifications', false); },
	showNotifications () { $.trigger('toggle-notifications', true); }
};


function toggleNotifications (show) {
	config.set('state.notifications', !!show);
	notifToggle.toggleClass('is-visible', !!show);
}

function onClick (e) {
	let target = $(e.target);
	if (target.is('.header-btn')) {
		e.preventDefault();
		const to = target.data('go');
		if (to && clickHandlers[to]) clickHandlers[to]();
	}
}

function onUrlChangeStart () { el.addClass('loading'); }
function onUrlChangeEnd () { el.removeClass('loading'); }

function onUrlChanged (webview) {
	btnBack.toggleClass('disabled', !webview.canGoBack());
	btnForw.toggleClass('disabled', !webview.canGoForward());
}


function init () {
	if (isReady) return;

	el = $('#header');
	starBox = el.find('.star-box');
	notifToggle = el.find('.notification-toggle');
	btnBack = el.find('.js-prev');
	btnForw = el.find('.js-next');

	el.on('click', onClick);
	$.on('toggle-notifications', toggleNotifications);
	$.on('url-changed', onUrlChanged);
	$.on('url-change-start', onUrlChangeStart);
	$.on('url-change-end', onUrlChangeEnd);

	toggleNotifications(config.get('state.notifications'));

	isReady = true;
}


module.exports = {
	init
};

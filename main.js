import React from 'react';
import ReactDOM from 'react-dom';

import Root from './view/root';
import store from './core/store';
import createHistory from 'history/createBrowserHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import { firebaseAuthen } from './core/firebase/config';
import { checkInitAuth } from './core/auth/email/actions';
import { changeLang } from './core/i18n/actions_reducers';
import { resizeWindow } from './core/layout/actions';
import 'semantic-ui-css/semantic.min.css';

const browserHistory = createHistory();
var language = localStorage.getItem('language') || 'chi' ;

function onPageEnter(dispatch) {
	return new Promise((resolve, reject) => {
		dispatch( changeLang(language) );
		dispatch( resizeWindow() );
		const unsubscribe = firebaseAuthen.onAuthStateChanged(
			user => {
				dispatch( checkInitAuth(user) );
				unsubscribe();
				resolve();
			},
			error => reject(error)
		);
	})
}

onPageEnter(store.dispatch)
	.then(
		() => { ReactDOM.render(
		<Root store={store}/>, 
		document.getElementById('app')
		) }
	)
	.catch(error => console.error(error));
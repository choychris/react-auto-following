import { authReducer } from './auth/email/reducer';
import { langReducer } from './i18n/actions_reducers';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { layoutReducer } from './layout/reducer';
import { instagramReducer } from './instagram/reducer';
import { brainTreeReduer } from './brainTree/reducer';


export default combineReducers({
	auth: authReducer,
	lang: langReducer,
	layout: layoutReducer,
	ig: instagramReducer,
	brainTree: brainTreeReduer
});


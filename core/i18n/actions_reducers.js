export const changeLang = (lang) => {
	return {
		type: 'CHANGE_LANG',
		lang: lang
	}
};

export const langReducer = (state = 'chi', action) => {
	switch(action.type) {
		case 'CHANGE_LANG':
			return action.lang
		default:
		 	return state	
	}
};


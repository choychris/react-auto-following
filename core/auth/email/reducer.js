const NoUserState = {
	authenticated: false,
	currentUser: null,
	errorMessage: null
}

export function authReducer(state = NoUserState, authenAction) {
	switch(authenAction.type){
		case "CHECK_INIT_AUTH":
			return Object.assign({}, NoUserState, {
				authenticated: authenAction.authenticated,
				currentUser: authenAction.currentUser
			})
		case 'SUCCESS_SIGN_UP':
			return Object.assign({}, NoUserState, {
				authenticated: authenAction.authenticated,
				currentUser: authenAction.currentUser
			})
		case 'ERROR_SIGN_UP':
			return Object.assign({}, NoUserState, {
				errorMessage: authenAction.errorMessage
			})
		case 'CONFIRM_PASSWORD':
			return Object.assign({}, NoUserState, {
				errorMessage: authenAction.errorMessage
			})
		case 'SIGN_OUT_SUCCESS':
			return NoUserState
		case 'PASSWORD_RESET':
			return {
				...state,
				resetEmail: true
			}
		default:
			return state
	}
}
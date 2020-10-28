import { combineReducers } from 'redux';

export const brainTreeReduer = (state = {days:1, price: 20}, action) => {
	switch(action.type){
		case 'CLIENT_TOKEN':
			return {
				...state,
				clientToken:action.token
			}
		case 'ENTER_DAYS':
			let valid = action.day <= 0 ? 1 : action.day
			let charge = (day) => {
				if (day<5){
					return 20 * day
				}
				else if (5<= day <10) {
					return 20 * day * 0.9
				} else {
					return 20 * day * 0.8
				}
			}
			return {
				...state,
				days: valid,
				price: charge(valid)
			}
		case 'PAYMENT_NONCE':
			return {
				...state,
				instance:action.instance
			}	
		default:
			return state
	}
}
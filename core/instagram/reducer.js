import { combineReducers } from 'redux';
import { historyReducer } from './history/reducer';

const connectAndFollowReducer = (state = {message: null, hashtags: []}, action) => {
	switch(action.type){
		case 'IG_LOGIN':
			return {...state, loginMessage: action.message, loginResult: action.result, requestStatus: 'done'}
		case 'REQUEST_SENT':
			return{...state, requestStatus: action.result}
		case 'CURRENT_IG':
			return{
				...state, 
				connected: action.connected, 
				username: action.username,  
				picture: action.picture
			}
		case 'DISCONNECT':
			return{
				...state,
				connected: false,
				username: null,
				picture: null
			}
		case 'SUBMIT_FOLLOW':
			return{
				...state,
				submitFollowMessage: action.message,
				requestStatus: action.result,
				currentTarget: action.currentTarget,
				currentService: action.service
			}
		case 'INPUT_USER':
			return{
				...state,
				target: action.target
			}
		case 'CHANGE_LOCATION':
			return{
				...state,
				location: action.location
			}
		case 'ADD_HASHTAG':
			let duplicate = false;
			state.hashtags.map(hashtag => {
				if(action.hashtag == hashtag){
					duplicate = true;
				}
			})
			return{
				...state,
				hashtags: duplicate ? state.hashtags : [...state.hashtags, action.hashtag]
			}
		case 'REMOVE_HASHTAG':
			let filtered = state.hashtags.filter((hashtag) => hashtag != action.hashtag);
			return{
				...state,
				hashtags: filtered
			}
		case 'CHECK_ENDED':
			return{
				...state,
				notEnded: action.notEnded,
				currentTarget: action.currentTarget,
				requestStatus: action.requestStatus,
				currentService: action.service
			}		
		case 'OBTAIN_ERROR':
			return{...state, message: action.message }
		default:
		 	return state
	}
}

export const instagramReducer = combineReducers({
	connectAndFollow: connectAndFollowReducer,
	history: historyReducer
})


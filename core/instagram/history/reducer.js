import { combineReducers } from 'redux'

let getTime = (time) => {
	let followTime = new Date(time);
	let dd = (followTime.getDate() < 10) ? '0'+ followTime.getDate() : followTime.getDate() ;
	let mm = (followTime.getMonth()+1 < 10) ? ('0'+ (followTime.getMonth()+1)) : (followTime.getMonth()+1) ; //January is 0!
	let yyyy = followTime.getFullYear();
	let hh = followTime.getHours();
	let min = (followTime.getMinutes() < 10) ? ('0' + followTime.getMinutes()) : followTime.getMinutes() ;
	return (hh + ':' + min + ' - ' + dd + '/' + mm + '/' + yyyy);
};

const followedList = (state = [], action) => {
	switch(action.type){
		case 'GET_CURRENT':
		const { followedTime, userName, userPicture } = action
			return [
				{
					followTime: getTime(followedTime),
					userName,
					userPicture
				},
				...state
			]
		case 'CLEAR_LIST':	
			let emptyList = [];
			return emptyList
		case 'NEXT_PAGE':
			let clearList = [];
			return clearList
		default:
			return state
	}
}

const historyCampgainList = (state = [], action) => {
	switch(action.type){
		case 'GET_HISTORY':
		const { key, id, start, end, service, topic, target } = action

		return [
			{
				key,
				id,
				start,
				end:getTime(end),
				service,
				topic,
				target
			},
			...state
		]
		case 'CLEAR_LIST':	
			let emptyList = [];
			return emptyList
		default:
			return state
	}
}

const campaginInfo = (state = {followBackList: [], page: 0}, action) => {
	switch(action.type){
		case 'CAMPAGIN_INFO':
			const { topic, target, startTime, followedCount, endStatus, service } = action;
			return {
				...state,
				topic,
				target,
				startTime,
				followedCount,
				endStatus,
				service
			}
		case 'SELECT_HISTORY':
			const { key, histStart, histEnd, histService, histTopic, histTarget } = action;
			return {
				...state,
				key,
				histStart,
				histEnd,
				histService,
				histTopic,
				histTarget
			}
		case 'FOLLOWBACK_LIST':
			const { userName, userPicture } = action
			let newlist = [ {userName, userPicture}, ...state.followBackList ]
			return {
				...state,
				followBackList: newlist
			}
		case 'CLEAR_LIST':
			return {
				...state,
				followBackList: [],
				topic: null,
				target: null,
				startTime: null,
				followedCount: 0,
				endStatus: null,
				service: null,
				key: null,
				histStart: null,
				histEnd: null,
				histService: null,
				histTopic: null,
				histTarget: null
			}
		case 'NEXT_PAGE':
			const { page } = action
			let hasMore = page == 12 ? false : true;
			return {
				...state,
				page,
				hasMore
			}
		default:
		 return state
	}
}

const totalCount = (state = {totalFollow: 0, totalUnfollow: 0, unfollowLeft:0}, action) => {
	switch(action.type){
		case 'FOLLOW_COUNT':
		return{
			...state,
			totalFollow: action.num
		}
		case 'UNFOLLOW_COUNT':
		return{
			...state,
			totalUnfollow: action.num
		}
		case 'UNFOLLOW_LEFT':
		return{
			...state,
			unfollowLeft: action.num
		}
		default:
			return state
	}
}

export const historyReducer = combineReducers({
	followedList,
	historyCampgainList,
	campaginInfo,
	totalCount
})

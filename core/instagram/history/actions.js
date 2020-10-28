import { firebaseAuthen, firebaseApp, firebasedb } from '../../firebase/config';
import 'whatwg-fetch';
const api_host = process.env.NODE_ENV == 'production'? 'YOUR_API_URL' : 'http://localhost:3000';

export const getFollowedUser = (followedTime, userName, userPicture) => {
	return {
		type: 'GET_CURRENT',
		followedTime,
		userName,
		userPicture
	}
}


export const getCampaginInfo = (topic, startTime, target, followedCount, endStatus, service) => {
	return {
		type: 'CAMPAGIN_INFO',
		topic,
		startTime,
		target,
		followedCount,
		endStatus,
		service
	}
}

export const getHistoryCompagin = (key, id, start, end, service, topic, target) => {
	return {
		type: 'GET_HISTORY',
		key,
		id,
		start,
		end,
		service,
		topic,
		target,
	}
}

export const clearList = () => {
	 return {
	 	type: 'CLEAR_LIST'
	 }
}

export const totalFollowCount = (num) => {
	return {
		type: 'FOLLOW_COUNT',
		num
	}
}

export const totalUnfollowCount = (num) => {
	return {
		type: 'UNFOLLOW_COUNT',
		num
	}
}

const calculateUnfollowLeft = (num) => {
	return {
		type: 'UNFOLLOW_LEFT',
		num
	}
}

export const getUnfollowLeft = () => {
	return dispatch => {
		let userId = firebaseAuthen.currentUser.uid;
		let followRef = firebasedb.ref('users/' + userId + '/allFollowed')
		let filterRef = followRef.orderByChild('unfollowed').equalTo(true)
		filterRef.once('value')
		.then(snapshot => {
			let a = snapshot.numChildren();
			firebasedb.ref('users/' + userId + '/allFollowed').once('value')
			.then(snapshot => {
				if(snapshot.exists()){
					let b = snapshot.numChildren();
					let unfollowLeft = (b - a);
					dispatch(calculateUnfollowLeft(unfollowLeft));
				}
			})
		})
	}
}

const updateRequest = () => {
	return {
		type: 'UPDATE_REQUEST'
	}
}

export const selectOneCampagin = (key, histStart, histEnd, histService, histTopic, histTarget) => {
	return {
		type: 'SELECT_HISTORY',
		key,
		histStart,
		histEnd,
		histService,
		histTopic,
		histTarget
	}
}

export const followBackList = (userName, userPicture) => {
	return {
		type: 'FOLLOWBACK_LIST',
		userName,
		userPicture
	}
}

export const selectedCampagin = (key, start, end, service, topic, target) => {
	return dispatch => {
		var userId = firebaseAuthen.currentUser.uid;
		var api = new Request(`${api_host}/api/checkFollowedBack/${userId}`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				body: JSON.stringify({
					key: key
				}),
				cache:'default'
			});
			dispatch(updateRequest());
			fetch(api)
			dispatch(selectOneCampagin(key, start, end, service, topic, target))
	}	
}

export const pageChange = (page) => {
	return {
		type: 'NEXT_PAGE',
		page
	}
}

export const onChangePage = (pageNumber, key) => {
	return dispatch => {
		let userId = firebaseAuthen.currentUser.uid;
		let firebaseQueryEnd = (600 - (pageNumber - 1) * 50)

		dispatch(pageChange(pageNumber))

		let followRef = firebasedb.ref('users/' + userId + '/historyCampagin/' + key + '/followed')
		let refQuery = followRef.orderByChild('num').endAt(firebaseQueryEnd).limitToLast(50)
		refQuery.once('value')
		.then(snapshot => {
			console.log(snapshot);
			snapshot.forEach(child => {
				let {picture, time, userName} = child.val()
				dispatch(getFollowedUser(time, userName, picture))
			})
		})
	}
}
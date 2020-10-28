import { firebaseAuthen, firebaseApp, firebasedb } from '../firebase/config';
import { submitFollow, requestSent } from './actions';
import 'whatwg-fetch';
const api_host = process.env.NODE_ENV == 'production'? 'YOUR_API_URL' : 'http://localhost:3000';

export const addHashtag = (hashtag) => {
	return{
		type:'ADD_HASHTAG',
		hashtag
	}
}

export const removeHashtag = (hashtag) => {
	return{
		type:'REMOVE_HASHTAG',
		hashtag
	}
}

export const imedHashtagFollow = (input) => {
	return dispatch => {
		var userId = firebaseAuthen.currentUser.uid;
		firebasedb.ref('users/' + userId + '/campaginCount').once('value')
			.then(snapshot => {
				let newCount = snapshot.val() + 1;

				function createDateTime(){
						var today = new Date();
						var dd = (today.getDate() < 10) ? '0'+ today.getDate() : today.getDate() ;
						var mm = (today.getMonth()+1 < 10) ? ('0'+ (today.getMonth()+1)) : (today.getMonth()+1) ; //January is 0!
						var yyyy = today.getFullYear();
						var hh = today.getHours();
						var min = (today.getMinutes() < 10) ? '0'+ today.getMinutes() : today.getMinutes() ;
						return (hh + ':' + min + ' - ' + dd + '/' + mm + '/' + yyyy);
				}

				var start = new Request(`${api_host}/api/hashtagFollow/${userId}`,
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					mode: 'cors',
					body: JSON.stringify({
						targetHashtag: input 
					}),
					cache:'default'
				});

				dispatch(requestSent());
	
				fetch(start)
				.then(function(res){
					if(res.ok){
						firebasedb.ref('users/' + userId).update({campaginCount: newCount})
						firebasedb.ref('users/' + userId + '/latestCampagin').set(
							{
							id: newCount,
							ended: false,
							service: 'FOLLOW',
							topic: 'HASHTAG',
							targetHashtag: '#' + input.join(', #'),
							startTime: createDateTime()
						})
						firebasedb.ref('global').child('allCampaginCount').once('value')
						.then(snapshot=> {
							let increment = snapshot.val() + 1;
							firebasedb.ref('global').update({allCampaginCount: increment})
						})
						dispatch(submitFollow(res.status, '#' + input.join(', #'), 'FOLLOW'))
					} 						
				}).catch(error => {
					console.log(error);
					dispatch(submitFollow(error));
				})
		})
	}
}
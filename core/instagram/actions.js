import firebase from 'firebase';
import 'whatwg-fetch';
import { firebaseAuthen, firebaseApp, firebasedb } from '../firebase/config';

const api_host = process.env.NODE_ENV === 'production'? 'YOUR_API_URL' : 'http://localhost:3000';

//==================== Connect to Instagram action =================================

const getMessage = (status) => {
	switch(status){
		case 201:
		 	return '連接成功。Connect Instagram Successfully.'
		case 400:
			return '賬戶或密碼不正確。Make sure Username and Password is correct.'
		case 406:
			return '抱歉，我們已有此賬戶的紀錄。Sorry, this account is in our record.'
		case 404:
			return '抱歉，未能連接成功，請重新嘗試或聯絡我們提供協助 support@1forall.shop'
		case 403:
			return '未能連接，請先開啟Instagram app 確認 "這是我" (It was me)，然後再嘗試一次'
	}
}

const igLogin = (status) => {
	return {
		type: 'IG_LOGIN',
		message: getMessage(status),
		result: (status == '201' )? 'success' : 'error'
	}	
}	

export const requestSent = () => {
		return {
			type: 'REQUEST_SENT',
			result: 'sent'
		}
}

const initialConnect = (username, pw, action, userId) => {

}

export const connectInstagram = (username, pw, action) => {
	return dispatch => {
		let userId = firebaseAuthen.currentUser.uid;
		if(action == 'inital'){
			firebasedb.ref('global/proxyURL').limitToFirst(1).once('value')
			.then(snapshot => {
					let arr = snapshot.val();
					let arr2 = Object.keys(arr);
					let key = arr2[0];
					firebasedb.ref('global/proxyURL').child(key).once('value')
					.then(snapshot => {
						let proxyURL = snapshot.val();
						let connectIG = new Request(`${api_host}/api/connectIg`,
						{
							method: 'POST',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
							},
							mode: 'cors',
							body: JSON.stringify({
								name: username,
								password: pw,
								userId: userId,
								proxyURL: proxyURL,
								action: action
							}),
							cache:'default'
						});
						
						dispatch(requestSent());
						fetch(connectIG).then(function(res){
							dispatch(igLogin(res.status))
							if(res.ok){
								firebasedb.ref('global/proxyURL').child(key).set(null);
							}
						});
					})	
			})
		} else {
			let connectIG = new Request(`${api_host}/api/connectIg`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				body: JSON.stringify({
					name: username,
					password: pw,
					userId: userId,
					action: action
				}),
				cache:'default'
			});
			
			dispatch(requestSent());
			fetch(connectIG).then(function(res){
				dispatch(igLogin(res.status))
			});
		}
	}
}	
//====================================================================================

//========================== Check IG connect ========================================
const currentIgAccount = (username, picture) => {
	return { 
		type: "CURRENT_IG",
		connected: username ? true : false,
		username: username,
		picture: picture
	}
}

const igInfoDbError = (error) => {
	return {
		type: "OBTAIN_ERROR",
		message: error.message
	}
}

export const disconnectIg = () => {
	return {
		type:"DISCONNECT"
	}
}	

export const obtainIgInfo = () => {
	return dispatch => {
		var userId = firebaseAuthen.currentUser.uid;
		firebasedb.ref('users/' + userId + '/igInfo').once('value')
			.then(snapshot => {
				var username = snapshot.val().igName;
				var picture = snapshot.val().igPicture;
				dispatch(currentIgAccount(username, picture))
			})
			.catch(error => { dispatch(igInfoDbError(error))})
	}	
}
//====================================================================================

//========================== Specific follow  ========================================

const getStatus = (status) => {
	switch(status){
		case 200:
			return 'success'
		case 403:
			return 'forbidden'
		case 404:
			return 'not_found'
		default:
			return 'error'	
	}
}

export const submitFollow = (status, target, service) => {
	return {
		type: "SUBMIT_FOLLOW",
		message: (status == '200') ? '創建成功，開始自動追蹤' : '創建失敗，請重新嘗試或聯絡我們',
		result: getStatus(status),
		currentTarget: null || target,
		service
	}
}

export const inputUser = (input) => {
	return{
		type: "INPUT_USER",
		target: null || input
	}
}

export const imedSpecificFollow = (input) => {
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

				var start = new Request(`${api_host}/api/specificFollow/${userId}`,
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					mode: 'cors',
					body: JSON.stringify({
						targetUser: input
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
							topic: 'SPECIFIC',
							targetUser: input,
							startTime: createDateTime()
						})
						firebasedb.ref('global').child('allCampaginCount').once('value')
						.then(snapshot=> {
							let increment = snapshot.val() + 1;
							firebasedb.ref('global').update({allCampaginCount: increment})
						})
						dispatch(submitFollow(res.status, input, 'FOLLOW'))
					} else {
						dispatch(submitFollow(res.status, input, 'FOLLOW'))
					}						
				}).catch(error => {
					console.log(error);
					dispatch(submitFollow(error));
				})
		})
	}
}

// ========================= check to disable imediate start ==========================

export const checkEnded = (data, status, target, service) => {
	return {
		type: 'CHECK_ENDED',
		notEnded: !data,
		currentTarget: null || target,
		requestStatus: null || status,
		service: service
	}
}

export const checkRunningCampaign = () => {
	return dispatch => {
		var userId = firebaseAuthen.currentUser.uid;
		firebasedb.ref('users/' + userId + '/latestCampagin').once('value')
		.then(snapshot => {
			let { ended, service } = snapshot.val();
			let target = snapshot.val().targetUser || snapshot.val().targetedLocation || snapshot.val().targetHashtag
			dispatch(checkEnded(ended, null, target, service));
		})
	}	
}




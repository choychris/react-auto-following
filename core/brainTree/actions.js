import firebase from 'firebase';
import 'whatwg-fetch';
import { firebaseAuthen, firebaseApp, firebasedb } from '../firebase/config';
const api_host = process.env.NODE_ENV == 'production'? 'https://api.1forall.shop' : 'http://localhost:3000';

export const getClientToken = () => {
	return dispatch => {
			let userId = firebaseAuthen.currentUser.uid;
			let getRequest = new Request(`${api_host}/api/braintree_Client_Token/${userId}`,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				cache:'default'
			});

		fetch(getRequest).then(function(res){
			if(res.ok){
				return res.text()
			}
		}).then(text => {
			dispatch(clientToken(text))
		})
	}
}

const clientToken = (token) => {
	return {
		type: 'CLIENT_TOKEN',
		token
	}
}

export const getInstance = (instance) => {
	return {
		type: 'PAYMENT_NONCE',
		instance
	}
}

export const enterDays = (day) => {
	return {
		type: 'ENTER_DAYS',
		day
	}
}

export const sendPaymentNonceToServer = (instance, amount) => {
	return dispatch => {
		 let userId = firebaseAuthen.currentUser.uid;
		 instance.requestPaymentMethod(function (err, payload) {
		      if(err){
		        console.error(err)
		      }
		      let paymentNonce = payload.nonce;
		      let sendToServer = new Request(`${api_host}/api/braintree_Payment_Method/${userId}`,
		        {
		          method: 'POST',
		          headers: {
		            'Accept': 'application/json',
		            'Content-Type': 'application/json'
		          },
		          mode: 'cors',
		          body: JSON.stringify({
		            payment_method_nonce: paymentNonce,
		            amount: amount
		          }),
		          cache:'default'
		        });
		      fetch(sendToServer).then(res => {
		        if(res.ok){
		          console.log(res.status)
		        }
		      })
		  }); 
	}
}

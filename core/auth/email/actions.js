import firebase from 'firebase';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../firebase/config';


const successSignUp = (result, user) => {
	return {
		type: 'SUCCESS_SIGN_UP',
		currentUser: result.email,
		authenticated: user.emailVerified,

	}
}

const errorSignUp = (error) => {
	return {
		type: "ERROR_SIGN_UP",
		errorMessage: error.message
	}
}

const confirmPw = (pw, confirmpw) => {
	return{
		type: "CONFIRM_PASSWORD",
		errorMessage: "Please make sure Confirm Password is the same."
	}
}

export const checkInitAuth = (user) => {
	return {
		type: "CHECK_INIT_AUTH",
		authenticated: user ? user.emailVerified : false,
		currentUser: user ? user.email : null
	}
}

export const emailSignUp = (email, password, confirmPassword) => {
	return dispatch => { 
		if(password === confirmPassword){
			firebaseAuthen.createUserWithEmailAndPassword(email, password)
			.then(
				(result) => { 
					firebaseAuthen.currentUser.sendEmailVerification();
					let currentUser = firebaseAuthen.currentUser;

					dispatch(successSignUp(result, currentUser)); 
					var userId = result.uid;
					var userEmail = result.email

					function createDateTime(){
						var today = new Date();
						var dd = (today.getDate() < 10) ? '0'+ today.getDate() : today.getDate() ;
						var mm = (today.getMonth()+1 < 10) ? ('0'+ (today.getMonth()+1)) : (today.getMonth()+1) ; //January is 0!
						var yyyy = today.getFullYear();
						var hh = today.getHours();
						return (hh + ' - ' + dd + '/' + mm + '/' + yyyy);
					}

					firebasedb.ref('users/' + userId).update(
						{
							email: userEmail, 
							createDate: createDateTime(), 
							credit: 3, 
							campaginCount: 0,
							totalUnfollowCount: 0 
						});
					// firebasedb.ref('users/' + userId).child('email').set(userEmail);
					// firebasedb.ref('users/' + userId).child('createDate').set(createDate());
					// firebasedb.ref('users/' + userId).child('status').set('freeTier');
					// firebasedb.ref('users/' + userId).child('campaginCounts').set(0);
				}
			)
			.catch(
				(error) => { dispatch(errorSignUp(error) ) 
					console.log(error)}
			);
		} else { dispatch(confirmPw(password, confirmPassword)) }
	}	
}

export const emailSignIn = (email, password) => {
	return dispatch => { 
		firebaseAuthen.signInWithEmailAndPassword(email, password)
		.then(
			(result) => { 
				let user = firebaseAuthen.currentUser;
				dispatch(successSignUp(result, user)) 
			}
		)
		.catch(
			(error) => { dispatch(errorSignUp(error)) 
				console.log(error) }
		);	
	}	
}

export const signOut = () => {
  return dispatch => {
    firebaseAuthen.signOut()
      .then(() => dispatch(signOutSuccess()));
  };
}

const signOutSuccess = () => {
  return {
    type: 'SIGN_OUT_SUCCESS'
  };
}

export const passwordReset = () => {
	return {
		type: 'PASSWORD_RESET'
	}
}


import React from 'react';
import { passwordReset }from '../../core/auth/email/actions';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { firebaseAuthen } from '../../core/firebase/config';

const mapStateToProps = (state) => {
	return {
		authenState: state.auth
	}
}


const resetContainer = ({authenState, dispatch}) => {

	let handleSubmit = (event) => {
		event.preventDefault();
		let email = event.target.elements[0].value

		firebaseAuthen.sendPasswordResetEmail(email)
		.then( () => { 
			dispatch(passwordReset()); 
			
		} )
		event.target.elements[0].value = ''
	}

	let message = (authenState) => {
		if (authenState.resetEmail) {
			return <div className="alert alert-info"> 密碼重設電郵已發出。如果你未收到郵件，請檢查你的濫發郵件夾，或重發電郵。</div>
		}
	}

	if (authenState.authenticated) {
		return <Redirect to={{pathname:'/'}} />
	} else {
		return (
			<div>

				<nav className="navbar navbar-inverse">
					<div className="container-fluid">
						<div className="navbar-header">
							<Link className="middle-brand" to="/">1ForAll</Link>
						</div>
					</div>
				</nav>
				<div >
					{ message(authenState) }
					<div className="panel panel-primary panel-authen">
						<div className="panel-body">
							<h4>Reset password</h4>
							<form onSubmit={ handleSubmit }>
							  <div className="form-group">
							    <label htmlFor="InputEmail1">Email address</label>
							    <input type="email" className="form-control" id="InputEmail1" placeholder="Email" />
							  </div>					  
							  <div className="registerform">
								  <button type="submit" className="btn btn-default btn-primary">Send me password reset email</button>
								  <p style={{marginTop:'20px'}}>Don't have an account? <Link to="register">Register here.</Link></p>
								  <p style={{marginTop:'5px'}}>If you have an account. <Link to="login">Login here.</Link></p>
							  </div>
							</form>
						</div>
					</div>
				</div>
				<div style={{textAlign:'center', marginTop:'30px'}}>
					<span>Authentication by</span>
					<br/>
					<img src="/src/assets/Logo_Google.png" style={{width:"80px", heigth:"28px"}}/>
				</div>
			</div>
		)
	}
}



export default connect(mapStateToProps)(resetContainer);
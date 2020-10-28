import React from 'react';
import { emailSignIn }from '../../core/auth/email/actions';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import ErrorMessage from './errorMessage';

const mapStateToProps = (state) => {
	return {
		authenState: state.auth
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSignInSubmit: (email, password) => {
			dispatch(emailSignIn(email, password));
		}
	}
}

const logInContainer = ({authenState, onSignInSubmit}) => {

	let handleSubmit = (event) => {
		event.preventDefault();
		var email = event.target.elements[0].value
		var password = event.target.elements[1].value
		onSignInSubmit(email, password);
	}

	let message = (authenState) => {
		if (authenState.errorMessage) {
			return <ErrorMessage message={authenState.errorMessage} />
		}
	}

	if (authenState.authenticated) {
		return <Redirect to={{pathname:'/account'}} />
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
							<h4>Log In</h4>
							<form onSubmit={ handleSubmit }>
							  <div className="form-group">
							    <label htmlFor="InputEmail1">Email address</label>
							    <input type="email" className="form-control" id="InputEmail1" placeholder="Email" />
							  </div>					  
							  <div className="form-group">
							    <label htmlFor="InputPassword1">Password</label>
							    <input type="password" className="form-control" id="InputPassword1" placeholder="Password" />
							  </div>
							  <div className="registerform">
								  <button type="submit" className="btn btn-default">Log in</button>
								  <p style={{marginTop:'20px'}}>Don't have an account? <Link to="register">Register here.</Link></p>
								  <p style={{marginTop:'20px'}}>Forget password. <Link to="resetpassword">Reset here.</Link></p>
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

const Login = connect(
	mapStateToProps,
	mapDispatchToProps
)(logInContainer)

export default Login
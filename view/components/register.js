import React from 'react';
import { emailSignUp }from '../../core/auth/email/actions';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import ErrorMessage from './errorMessage';

const mapStateToProps = (state) => {
	return {
		authenState: state.auth,
		langState: state.lang
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSignUpSubmit: (email, password, confirmpassword) => {
			dispatch(emailSignUp(email, password, confirmpassword));
		}
	}
}

const register = ({authenState,langState, onSignUpSubmit}) => {

	let handleSubmit = (event) => {
		event.preventDefault();
		var email = event.target.elements[0].value
		var password = event.target.elements[1].value
		var confirmpassword = event.target.elements[2].value
		onSignUpSubmit(email, password, confirmpassword);
	}

	let message = (authenState) => {
		if (authenState.errorMessage) {
			return <ErrorMessage message={authenState.errorMessage} />
		}
	}

	if (authenState.currentUser) {
		return <Redirect to={{pathname:'/thank-you'}} />
	} else { 
		return (
			<div>
				<nav className="navbar navbar-inverse">
					<div className="container-fluid">
						<div className="navbar-header">
							<Link to="/" className="middle-brand">1ForAll</Link>
						</div>
					</div>
				</nav>
				{ message(authenState) }
				<div className="panel panel-primary panel-authen">
					<div className="panel-body">
						<h4>{langState == 'en' ? 'Register an Account':'註冊'}</h4>
						<form onSubmit={ handleSubmit }>
						  <div className="form-group">
						    <label htmlFor="InputEmail1">{langState == 'en' ?'Email address':'電郵'}</label>
						    <input type="email" className="form-control" id="InputEmail1" placeholder="Email" />
						  </div>					  
						  <div className="form-group">
						    <label htmlFor="InputPassword1">{langState == 'en' ?'Password':'密碼'}</label>
						    <input type="password" className="form-control" id="InputPassword1" placeholder="Password" />
						  </div>
						  <div className="form-group">
						    <label htmlFor="ConfirmPassword1">{langState == 'en' ?'Confirm Password':'重覆密碼'}</label>
						    <input type="password" className="form-control" id="ConfirmPassword1" placeholder="Confirm Password" />
						  </div>
						  <div className="registerform">
							  <button type="submit" className="btn btn-primary">{langState == 'en' ?'Pre-register !':'註冊！'}</button>
							  <p style={{marginTop:'20px'}}>{langState == 'en' ?'We do not take any other personal information.':'在登錄中我們不需要其他的個人資料'}</p>
						  </div>
						</form>
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

const registerForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(register)

export default registerForm;
//<p>If you already have an account, <Link to="login">Log in</Link> </p>
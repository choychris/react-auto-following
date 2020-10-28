import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { signOut } from '../../core/auth/email/actions';
import { changeLang } from '../../core/i18n/actions_reducers';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		authenState: state.auth,
		langState: state.lang
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSignOutSubmit: () => {
			dispatch( signOut() );
		},
		onLangChange: (lang) => {
			dispatch( changeLang(lang) );
		}
	}
}


const headerContainer = ({langState, authenState, onSignOutSubmit, onLangChange}) => {

	let checkAuthSate = (authenState) => {
		if(authenState.authenticated){
			return (
				<ul className="nav navbar-nav navbar-right">
					<li><a href='' onClick={onSignOutSubmit}>{ langState == 'en' ? 'Sign out': '登出'}<i className='fa fa-sign-out'></i></a></li>
					<li><Link to='/account'>{ langState == 'en' ? 'User Home': '用戶主頁'}<i className='fa fa-address-book-o'></i></Link></li>
				</ul>	
			)
		} else {
			return (
				<ul className="nav navbar-nav navbar-right">
					<li>
						<Link to="login"><i className='fa fa-user'></i> {langState == 'en' ? 'Login':'登入'}</Link>
					</li>
					<li>
						<Link to="register"><i className='fa fa-user-plus'></i> {langState == 'en' ? 'Register':'註冊賬號'}</Link>
					</li>
				</ul>	
			)
		}
	}

	return (
		<div>
			<nav className="navbar navbar-inverse" style={{paddingTop: '10px'}} >
				<div className="container-fluid">
					<Link to='/'><img className='logo' src='/src/assets/Logo_V3.png'/></Link>
					<ul className="nav navbar-nav navbar-right">
						<div className="btn-group" style={{margin:'10px'}}> 
							<button type="button" onClick={ () =>{localStorage.setItem('language', 'chi'); onLangChange('chi')} }
								className={langState == 'chi' ? "btn btn-sm btn-info active" : "btn btn-sm btn-info" }>繁體中文</button>
	
	  						<button type="button" onClick={ () =>{localStorage.setItem('language', 'en'); onLangChange('en')} }
	  							className={langState == 'en' ? "btn btn-sm btn-info active" : "btn btn-sm btn-info" }>English</button>
						</div>
					</ul>
						{ checkAuthSate(authenState) }
				</div>
			</nav>
			<nav className="navbar navbar-default navbar-lower" role="navigation">
			  <div className="container-fluid">
				  <div className="nav navbar-nav">
						<li><NavLink exact to="/" activeStyle={{textDecoration: 'underline'}}>{langState == 'en' ? 'About Us':'關於我們'}</NavLink></li>	
						<li><NavLink to="/features" activeStyle={{textDecoration: 'underline'}}>{langState == 'en' ? 'Features':'產品特色'}</NavLink></li>	
						<li><NavLink to="/pricing" activeStyle={{textDecoration: 'underline'}}>{langState == 'en' ? 'Pricing':'產品價格'}</NavLink></li>	
				   </div>
			   </div>
			</nav>
		</div>
	)
}

const Header = connect(
 mapStateToProps,
 mapDispatchToProps
)(headerContainer)


export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const mapStateToProps = (state) => {
	return {
		authenState: state.auth
	}
}


const thanksContainer = ({authenState}) => {

	if (!authenState.currentUser) {
		return <Redirect to={{pathname:'/'}} />
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
			<div className='container' style={{marginTop:'40px'}}>
				<div className='jumbotron'>
					<div className='container'>
						<h2>感謝你的註冊！ <img style={{width:'60px'}} src='/src/assets/simleyface.png'/></h2>
						<p>請驗證您的電子郵件地址。</p>
						<Link to='/' className="btn btn-primary btn-sm" > 回到 1ForAll 主頁 </Link>
						
					</div>
					<Link to='/account' className="btn btn-primary btn-sm" style={{marginTop: '30px'}}> 去用戶主頁 </Link>
				</div>
			</div>
		</div>
	)
}
}

const Thanks = connect(mapStateToProps)(thanksContainer);

export default Thanks;


import React from 'react';
import Header from '../header';
import { Benefits } from './benefits';
import Footer from './footer';
import { Link } from 'react-router-dom';
import { homeContent } from './staticContent/homePageStatic';
import StatisticGroupInverted from '../statistics';
import { Icon } from 'semantic-ui-react';


const HomePage = ({langState, authState}) => {
	if(langState == 'chi'){
		var detail = homeContent.chi;
	} else {
		var detail = homeContent.eng;
	}

	return (
	<div>
		<Header/>
		<div className="landing">
			<h1><strong>Welcome to 1ForAll</strong>.shop</h1>
			<h4>Your instagram smart helper</h4>
			<h4>1ForAll 是你的 Instagram 智能幫手</h4>
			<div className="home-btn">
				<hr/>
				{authState.authenticated ? '' : <Link to='/register' className="btn btn-lg btn-success">{detail[0]}</Link>}
				<div style={{marginTop: '30px', fontSize: '22px'}}>
				<span>1ForAll is trusted by</span>
				<br/>
				<img src="/src/assets/Logo_Google.png" style={{width:"80px", heigth:"28px"}}/>
				</div>
			</div>
		</div>
		<StatisticGroupInverted />
		<div className="what" style={{textAlign: "center"}}>
			<h2 style={{color:"#1B6D99", marginTop: '30px'}}>{detail[1]}</h2>
			<p style={{fontSize: "18px", marginTop: '20px'}}>{detail[11]}</p>
			<p style={{fontSize: "18px", marginTop: '20px'}}>{detail[2]}</p>
			<div>
			    <Icon.Group size='huge'>
			      <Icon size='big' name='sun' color='teal' size='big'/>
			      <Icon fitted name='users' color='teal'/>
			    </Icon.Group>
			</div>
			<Link to='/features' className="btn btn-lg btn-primary" style={{ marginTop: '20px'}}>{detail[3]}</Link>
		</div>
		<div className="why" style={{textAlign: "center"}}>
			<h2 style={{color:"#1B6D99"}}>{detail[4]}</h2>
			<p style={{fontSize: "16px", marginTop: '20px'}}>{detail[5]}</p>
			<p style={{fontSize: "16px", marginTop: '20px'}}>{detail[6]}</p>
			<p style={{fontSize: "16px", marginTop: '20px', color:'#5899E2'}}>{detail[7]}</p>
			<p style={{fontSize: "16px", marginTop: '20px', color:'#5899E2'}}>{detail[8]}</p>
			<Icon fitted name='idea' color='yellow' size='huge'/>
		</div>
		<Benefits/>
		<div style={{textAlign:'center', marginTop:'40px'}}>
			<p><Link to='/pricing' className="btn btn-lg btn-primary" style={{ marginTop: '20px'}}>{detail[9]}</Link></p>
			{authState.authenticated ? '' : <Link to='/register' className="btn btn-lg btn-success">{detail[10]}</Link>}
		</div>
		<Footer />
	</div>
	)
}

import { connect } from 'react-redux';
const mapStateToProps = (state) => {
	return {
		langState: state.lang,
		authState: state.auth
	}
};

export default connect(mapStateToProps)(HomePage);


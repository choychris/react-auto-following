import React from 'react';
import Header from '../header';
import Footer from './footer';
import { Link } from 'react-router-dom';
import { details, chicharge , engcharge } from './staticContent/pricingStatic';

//<p className="pricing-banner">{info.rotate}</p>


const FreeTier = ({info, lang}) => {
 	if(lang == 'chi'){
		var detail = details.chi;
	} else {
		var detail = details.eng;
	}

	return (
		<div className="col-sm-3">
			<div className="panel panel-default">
				<div className="panel-heading" style={{textAlign:'center'}}>{info.heading}</div>
				<div className="panel-body">
				<div style={{textAlign:'center'}}>
					<p style={{color:'#ED7E00'}}><strong>{detail[0]} </strong></p>
					<p><i className="fa fa-user"></i>{detail[1]} {info.follow} ({(info.follow)/10}/hour)</p>
					<p><i className="fa fa-user"></i> {detail[2]}  {info.follow} ({(info.follow)/10}/hour)</p>
					<p><i className="fa fa-heart"></i> {detail[3]}  {info.like} </p>
				</div>	
					<hr/>
					<p style={{textAlign:'center', color:'#ED7E00'}}><strong>{details.chi[4]}</strong></p>
					<div style={{marginLeft:'10%'}}>
						<p><i className="fa fa-lock" style={{color:'#A10702'}}></i> {detail[5]} </p>
						<p><i className="fa fa-lock" style={{color:'#A10702'}}></i> {detail[6]} </p>
						<p><i className="fa fa-lock" style={{color:'#A10702'}}></i> {detail[7]} </p>
						<p><i className="fa fa-lock" style={{color:'#A10702'}}></i> {detail[8]} </p>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[9]} </p>
					</div>
				</div>
				<h4 style={{textAlign:'center', color:'#1B6D99'}}>US$ {info.price}</h4>
			</div>
		</div>
	)
}

const Premium = ({info, lang}) => {
	if(lang == 'chi'){
		var detail = details.chi;
	} else {
		var detail = details.eng;
	}

	return (
		<div className="col-sm-3">
			<div className="panel panel-success">
				<div className="panel-heading" style={{textAlign:'center'}}>{info.heading}</div>
				<div className="panel-body">
				<div style={{textAlign:'center'}}>
					<p style={{color:'#ED7E00'}}><strong>{detail[0]} </strong></p>
					<p><i className="fa fa-user"></i>{detail[1]} {info.follow} ({(info.follow)/10}/hour)</p>
					<p><i className="fa fa-user"></i> {detail[2]}  {info.follow} ({(info.follow)/10}/hour)</p>
					<p><i className="fa fa-heart"></i> {detail[3]}  {info.like} </p>
				</div>	
					<hr/>
					<p style={{textAlign:'center', color:'#ED7E00'}}><strong>{details.chi[4]}</strong></p>
					<div style={{marginLeft:'10%'}}>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[5]} </p>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[6]} </p>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[7]} </p>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[8]} </p>
						<p><i className="fa fa-check" style={{color:'#6BA32C'}}></i> {detail[9]} </p>
					</div>
				</div>
				<h4 style={{textAlign:'center', color:'#1B6D99'}}>-TBC-</h4>
			</div>
		</div>
	)
}


const Pricing = ({langState}) => {

	if(langState == 'chi'){
		var charge = chicharge;
	} else {
		var charge = engcharge;
	}

	return (
		<div>
			<Header />
			<div className="container" style={{marginTop: '30px'}}>
				<div className="row">
					<FreeTier info={charge.freetier} lang={langState}/>
					{charge.premium.map(info => ( <Premium key={info.heading} info={info} lang={langState}/>))}
				</div>
				<div style={{textAlign:'center', marginTop:'30px'}}>
					<div className='col-sm-12'>
						{langState == 'chi'? 
							(<Link to='/register' className="btn btn-lg btn-success"> 現在註冊 <div>獲得 5 天免費高級服務</div></Link>) :
							(<Link to='/register' className="btn btn-lg btn-success"> Register now for <div>FREE 5 DAYS PREMIUM</div></Link>)
						}
						<h4>{langState == 'chi'? '註冊中我們不需要任何不必要的個人資料':'We do not take any unnecessary personal information in registration.'}</h4>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}

import { connect } from 'react-redux';
const mapStateToProps = (state) => {
	return {
		langState: state.lang
	}
};

export default connect(mapStateToProps)(Pricing);
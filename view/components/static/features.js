import React from 'react';
import Header from '../header';
import Footer from './footer';
import { engfeaturesStatic, chifeaturesStatic } from './staticContent/featuresStatic'


const Feature = ({title, subContent}) => (
	<div>
		<h3>{title}</h3>
		<p>{subContent[0]}</p>
		<p>{subContent[1]}</p>
		<p>{subContent[2]}</p>
	 </div>	
)

const FeatureList = ({featureGroup}) => {

	return (
		<div style={{marginBottom:'30px'}}>
			<div style={{textAlign:'center', color:'#1B6D99'}}><h1>{featureGroup.topic}</h1></div>
			<div className='row'>
				<div className='col-sm-6 feature-group'>
						<img src={featureGroup.img}/> 
				</div>
				<div className='col-sm-6'>{ featureGroup.subFeatures.map(feature =>
						<Feature key={feature.title} title={feature.title}  subContent={feature.subContent}/>
					)} 
				</div>
			</div>
		</div>
	)
};

const FeatureListMiddle = ({featureGroup}) => {

	return (
		<div style={{backgroundColor: 'rgba(138, 223, 243, 0.2)', paddingBottom:'30px'}}>
			<div className='container'>
			<div style={{textAlign:'center', color:'#1B6D99'}}><h1>{featureGroup.topic}</h1></div>
			<div className='row'>
				<div className='col-sm-6'>{ featureGroup.subFeatures.map(feature =>
						<Feature key={feature.title} title={feature.title}  subContent={feature.subContent}/>
					)} 
				</div>
				<div className='col-sm-6 feature-group'>
						<img src={featureGroup.img}/> 
				</div>
			</div>
			</div>
		</div>
	)
};




const Features = ({langState}) => {

	if(langState == 'chi'){
		var featuresStatic = chifeaturesStatic;
	} else {
		var featuresStatic = engfeaturesStatic;
	}

	return (
		<div>
			<Header />
			<div className='container'>
				<FeatureList featureGroup={featuresStatic[0]} />
			</div>	
				<FeatureListMiddle featureGroup={featuresStatic[1]} />
			<div className='container'>	
				<FeatureList featureGroup={featuresStatic[2]} />
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

export default connect(mapStateToProps)(Features);
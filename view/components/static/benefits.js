import React from 'react';
import { connect } from 'react-redux';
import { engbenefitsStatic, chibenefitsStatic } from './staticContent/benefitsStatic';
import { Item } from 'semantic-ui-react';

const mapStateToProps = (state) => {
	return {
		langState: state.lang
	}
};


const benefitsContainer = ({langState}) => {

	if(langState == 'chi'){
		var benefitsStatic = chibenefitsStatic;
	} else {
		var benefitsStatic = engbenefitsStatic;
	}

	return(
	<div className='container' style={{marginTop: '40px'}}>
		<Item.Group relaxed divided unstackable>
		{ benefitsStatic.map((benefit, index) => {
			return  <Item key={benefit.img}>
						<Item.Image size='tiny' src={benefit.img} centered/>
						<Item.Content verticalAlign='middle'>
					    	<Item.Header>{benefit.topic}</Item.Header>
					    	<Item.Description>{benefit.content}</Item.Description>
				     	</Item.Content>
				    </Item>
		}) }
		</Item.Group>
	</div>
	)
};

export const Benefits = connect(mapStateToProps)(benefitsContainer);






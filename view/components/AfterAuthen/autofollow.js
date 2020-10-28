import React from 'react';
import { Link , NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import { Image, Accordion, Segment, Button, Header, 
	Divider, Form, Input, Icon, Label, Embed, Grid} from 'semantic-ui-react';
import Layout from './layout';
import SpecificFollow from './specificFollow';
import LocationFollow from './locationFollow';
import HashtagFollow from './hashtagFollow';
import { autoFollowChoice } from '../../../core/layout/actions';

const mapStateToProps = (state) => {
	return{
			choice: state.layout.choice
	}
}

const AutoFollow = ({choice, dispatch}) => {
	let changeChoice = (input) =>{
		dispatch(autoFollowChoice(input))
	}

	let showChoice = () => {
		switch (choice){
			case 'SPECIFIC':
			 	return <SpecificFollow/>
			case 'LOCATION':
				return <LocationFollow/>
			case 'HASHTAG':
			 	return <HashtagFollow/>
			default:
				return <SpecificAc/>
		}
	}

	return (
		<Layout>
			<Header as='h2' style={{textAlign:'center'}}>創建新的 Auto Follow</Header>
			<Segment.Group>
				<Segment>
					<Grid>
						<Grid.Column width={16}>
						<div style={{textAlign:'center'}}>
							<Header as='h3'>請選擇一種方式去定義你的要追隨的用戶群</Header>
							<div className='selectTarget'>
								<Link to='/account/follow/sepcific'><Button basic={(choice!=='SPECIFIC')} color='blue' onClick={() => changeChoice('SPECIFIC')}>特定用戶</Button></Link>
								<Link to='/account/follow/location'><Button basic={(choice!=='LOCATION')} color='blue' onClick={() => changeChoice('LOCATION')}>根據地區</Button></Link>
								<Link to='/account/follow/hashtag'><Button basic={(choice!=='HASHTAG')} color='blue' onClick={() => changeChoice('HASHTAG')}>使用#hashtag</Button></Link>
							</div>
						</div>
						<Divider section />
						{showChoice()}
						</Grid.Column>
					</Grid>
				</Segment>
			</Segment.Group>
		</Layout>	
	)
}

export default connect(mapStateToProps)(AutoFollow);
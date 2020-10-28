import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';
import { Segment, Button, Header, Message, Flag, Icon, Divider, Container} from 'semantic-ui-react';
import { checkRunningCampaign, checkEnded } from '../../../core/instagram/actions';
import { imedLocationFollow, changeLocation } from '../../../core/instagram/bylocation_actions';
import { submitMessage } from './submitMessage'	

const mapStateToProps = (state) => {
	return {
		langState: state.lang,
		igState: state.ig.connectAndFollow
	}
} 

const mapDispatchToProps = (dispatch) => {
	return {
		onSubmitImeFollow: (input) => {
			dispatch(imedLocationFollow(input));
		},
		onComponentWillMount: () => {
			dispatch(checkRunningCampaign());
		},
		checkEnd: (value, status) => {
			dispatch(checkEnded(value, status, null))
		},
		onLocationButtonClick : (input) => {
			dispatch(changeLocation(input))
		}
	}
}

class LocationFollow extends React.Component {
	componentWillMount () {
		if(firebaseAuthen.currentUser){
	  		this.props.onComponentWillMount();
	  	}
	}

	componentDidMount () {
		let userId = firebaseAuthen.currentUser.uid;
		this._firebaseRef = firebasedb.ref('users/' + userId + '/latestCampagin/ended');
		this._firebaseRef.on('value', (snapshot) => {
			if (snapshot.val()){
				this.props.checkEnd(snapshot.val(), 'finish');
			}
		})
	} 
	  
	componentWillUnmount () {
    	this._firebaseRef.off();
  	}

	render() {
		let { langState, igState, onSubmitImeFollow, onLocationButtonClick } = this.props
		let showLocation = (input) => {
			switch(input){
				case 'HongKong':
					return <p>香港 Hong Kong</p>				
				case 'Taiwan':
					return <p>台灣 Taiwan</p>
				case 'Singapore':
					return <p>新加坡 Singapore</p>
				case 'Malaysia':
					return <p>馬來西亞 Malaysia</p>
				default:
					return 
			}
		}
		return (
			<div>
				{submitMessage(igState.notEnded, igState.requestStatus, igState.currentTarget, igState.currentService)}
				<Header as='h3'>特定地區內的用戶：</Header>
				<Segment className='selectTarget'>
						<Header as='h4'>請選擇地區</Header>
						<Button color='teal' onClick={() => {onLocationButtonClick('HongKong')}}><Flag name='hk'/>香港</Button>
						<Button color='teal' onClick={() => {onLocationButtonClick('Taiwan')}}><Flag name='tw'/>台灣</Button>
						<Button color='teal' onClick={() => {onLocationButtonClick('Singapore')}}><Flag name='sg'/>新加坡</Button>
						<Button color='teal' onClick={() => {onLocationButtonClick('Malaysia')}}><Flag name='my'/>馬來西亞</Button>
						<div style={{marginTop: '10px', marginBottom: '10px'}}>
							<Button disabled><Icon name='location arrow'/>更多地區將陸續加入 . . .</Button>
						</div>
						<Divider section />
						<Header as='h4'>己選擇地區：</Header>
						{ showLocation(igState.location) }
				</Segment>
				<Button size='large' color='green' style={{marginTop: '20px'}}
					disabled={ (!igState.location || igState.notEnded || igState.requestStatus == 'success' || !igState.connected || igState.requestStatus == 'sent') } 
					onClick={() => onSubmitImeFollow(igState.location)}
				>立即開始</Button>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationFollow);


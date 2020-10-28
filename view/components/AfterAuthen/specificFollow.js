import React, { Component } from 'react';
import { Image, Accordion, Segment, Button, Header, Message,
	Divider, Form, Input, Container, Icon, Label, Embed} from 'semantic-ui-react';
import { imedSpecificFollow, inputUser, checkRunningCampaign, checkEnded } from '../../../core/instagram/actions';
import { connect } from 'react-redux';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';
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
			dispatch(imedSpecificFollow(input));
		},
		onTargetInput: (input) => {
			dispatch(inputUser(input));
		},
		onComponentWillMount: () => {
			dispatch(checkRunningCampaign());
		},
		checkEnd: (value, status) => {
			dispatch(checkEnded(value, status, null))
		}
	}
}

class SpecificFollow extends React.Component {

	componentWillMount () {
		if(firebaseAuthen.currentUser){
	  		this.props.onComponentWillMount();
	  	}
	}

	componentDidMount () {
		let userId = firebaseAuthen.currentUser.uid;
		this._firebaseRef = firebasedb.ref('users/' + userId + '/latestCampagin/ended');
		this._firebaseRef.on('value', (snapshot) => {
			if(snapshot.val()){
				this.props.checkEnd(snapshot.val(), 'finish');
			}
		})
	} 
	  
	componentWillUnmount () {
    	this._firebaseRef.off();
  	}

	render() {
		let { langState, igState, onSubmitImeFollow, onTargetInput } = this.props

		let inputChange = (event) => {
			let input = event.target.value;
			onTargetInput(input);
		}

		let submit = () => {
			onSubmitImeFollow(igState.target);
		}


		return (
			<div>
				{submitMessage(igState.notEnded, igState.requestStatus, igState.currentTarget, igState.currentService)}
				<Header as='h3'>針對一位特定用戶的追隨者(Followers)：</Header>
				<Form>
				    <Form.Field>
					    <label><h4>請輸入特定用戶</h4></label>
					    <p>注意事項：</p>
					    <p>一. 你的目標應該最少有600粉絲數量</p>
					    <p>二. 你的目標不是私人賬戶(not private account)</p>
					    <p>三. 你的目標沒有封鎖你(not blocked)</p>
					    <Form.Input onChange={inputChange}
					    	size='large' icon='user' iconPosition='left' placeholder='用戶名字' style={{width:'200px'}}/>
					    
				    </Form.Field>
				</Form>
				<Accordion fluid style={{marginTop: '10px'}}>
					<Accordion.Title>
						<Button>
							<Icon name='dropdown' />
							提示：你可以使用 Instagram 的相關用戶功能去尋找更多相關用戶/競爭者
						</Button>	
					</Accordion.Title>
					<Accordion.Content>
						<Image src='/src/assets/suggestions.png'/>
					</Accordion.Content>
				</Accordion>
				<Segment.Group>
					<Container fluid>
						<Header as='h3' style={{marginTop: '10px', marginBottom: '10px'}}>
						<div>
							<Icon name='crosshairs' />{igState.target? '你的目標:' : '未輸入目標'}
						</div> 
							<a href={`https://www.instagram.com/${igState.target}`}>{igState.target}</a>
						</Header>
					</Container>
				</Segment.Group>
				<Button onClick={submit} size='large' color='green' 
					disabled={ (!igState.target || igState.notEnded || igState.requestStatus == 'success' || !igState.connected || igState.requestStatus == 'sent') }>立即開始</Button>
			</div>
		)
	}
}	

export default connect(mapStateToProps, mapDispatchToProps)(SpecificFollow);
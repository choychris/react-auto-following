import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';
import { Segment, Button, Header, Message,Icon, Divider, Form, Grid} from 'semantic-ui-react';
import { checkRunningCampaign, checkEnded } from '../../../core/instagram/actions';
import { addHashtag, removeHashtag, imedHashtagFollow } from '../../../core/instagram/byhashtag_actions';
import { submitMessage } from './submitMessage';

const mapStateToProps = (state) => {
	return {
		langState: state.lang,
		igState: state.ig.connectAndFollow
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onSubmitImeFollow: (input) => {
			dispatch(imedHashtagFollow(input));
		},
		onComponentWillMount: () => {
			dispatch(checkRunningCampaign());
		},
		checkEnd: (value, status) => {
			dispatch(checkEnded(value, status, null))
		},
		onHashtagAdd: (input) => {
			dispatch(addHashtag(input))
		},
		onHashTagRemove: (input) => {
			dispatch(removeHashtag(input))
		}
	}
}

class HashtagFollow extends React.Component {
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

	render () {
		let {langState, igState, onSubmitImeFollow, onHashtagAdd, onHashTagRemove} = this.props

		let formSubmit = (event) => {
			event.preventDefault();
			let hashtag = event.target.elements[0].value
			onHashtagAdd(hashtag.trim());
			event.target.elements[0].value = '';
		}

		return (
			<div>
				{submitMessage(igState.notEnded, igState.requestStatus, igState.currentTarget, igState.currentService)}
				<Header as='h3'>與 Hashtag 相關的用戶：</Header>
				<Grid stackable columns={2}>
					<Grid.Column>
						<Header as='h4'>請加入最多三個 Hashtags (不用輸入#)</Header>
						<Form onSubmit={formSubmit}>
					        <Form.Group widths='equal'>
					          <Form.Field control='input' placeholder='Hashtag' />
					        </Form.Group>
					        <Button color='teal' type='submit'
					        disabled={ (igState.hashtags.length >= 3) }
					        >新增</Button>
					        <Divider hidden />
				      	</Form>
			      	</Grid.Column>
			      	<Grid.Column>
			      		<Header as='h4'>己加入的 Hashtags</Header>
			      		<Segment.Group>
				      	{igState.hashtags.map(hashtag => {
				      		return <div key={hashtag} style={{margin: '10px 10px 10px 10px'}}><Button
				      		  color='red'
						      icon='remove'
						      label={{ basic: true, content: hashtag }}
						      labelPosition='left'
						      onClick={() => {onHashTagRemove(hashtag)}}
						    /></div>
				      	})}
				      	</Segment.Group>
			      	</Grid.Column> 	
		      	</Grid>
		      	<Button size='large' color='green' style={{marginTop: '20px'}}
		      		onClick={()=>{onSubmitImeFollow(igState.hashtags)}}
		      		disabled={ ((igState.hashtags.length < 1) || igState.notEnded || igState.requestStatus == 'success' || !igState.connected || igState.requestStatus == 'sent') }
					>立即開始</Button>
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(HashtagFollow);

//={ (!igState.hashtags || igState.notEnded) }
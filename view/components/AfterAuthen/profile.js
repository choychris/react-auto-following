import React from 'react'
import Layout from './layout'
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';
import { Button, Header, Icon, Modal, Form, Message, Segment, Divider } from 'semantic-ui-react';
import { connectInstagram } from '../../../core/instagram/actions';
import { connect } from 'react-redux';
import BraintreePayment from './braintreePayment'

const mapStateToProps = (state) => {
	return {
		langState: state.lang,
		igState: state.ig.connectAndFollow
	}
}

const Profile = ({igState, dispatch}) => {
	let onFormSubmit = (event) => {
		event.preventDefault();
		let username = event.target.elements[0].value;
		let pw = event.target.elements[1].value;
		let action = 'update';
		dispatch(connectInstagram(username, pw, action));
	}	

	let message = () => {
		if(igState.loginResult == 'success'){
    		return <Message success header='SUCCESS' content={igState.loginMessage}/> 
    	} else if (igState.loginResult == 'error'){
    		return <Form onSubmit={onFormSubmit} error loading={igState.requestStatus == 'sent'}>
			<Form.Field>
		      <label>Username</label>
		      <input type='text' placeholder='Instagram Username' />
	    	</Form.Field>		
	    	<Form.Field>
		      <label>Password</label>
		      <input type='password' placeholder='Instagram Password' />
	    	</Form.Field>
	    	<Message error header='NOT SUCCESS' content={igState.loginMessage}/> 
	    	{ igState.loginMessage == '未能連接，請先開啟Instagram app 確認 "這是我" (It was me)，然後再嘗試一次' ? <Image src={'/src/assets/itwasme.jpeg'} size='small' centered/> : null} 
		   	<Button type='submit' color='green'>
		      <Icon name='checkmark' /> 更新
		    </Button>
			</Form> 
    } else {
    	return <Form onSubmit={onFormSubmit} loading={igState.requestStatus == 'sent'}>
							<Form.Field>
					      <label>Username</label>
					      <input type='text' placeholder='Instagram Username' />
				    	</Form.Field>		
				    	<Form.Field>
					      <label>Password</label>
					      <input type='password' placeholder='Instagram Password' />
				    	</Form.Field>
					   	<Button type='submit' color='green'>
					      <Icon name='checkmark' /> 更新
					    </Button>
	  				 </Form> 
    	}
	}

	let canUpdate = () => {
		if(igState.username){
			return message()
		} else {
			return <p>Please connect your Instagram first</p>
		}
	}

	return(
		<Layout>
			<Segment.Group>
				<Segment>

					<Header icon='instagram' content='更新 Instagram 登入資料'/>
					{ canUpdate() }
				</Segment>
			</Segment.Group>	
		</Layout>

	)
}

					//<BraintreePayment/>
					//<Divider section/>
					

export default connect(mapStateToProps)(Profile);
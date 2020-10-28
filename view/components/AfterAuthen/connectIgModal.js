import React from 'react';
import { Button, Header, Icon, Modal, Form, Message, Image} from 'semantic-ui-react';
import { connect } from 'react-redux';

// ============================ actions import =================================
import { connectInstagram, obtainIgInfo } from '../../../core/instagram/actions';

const mapStateToProps = (state) => {
	return {
		langState: state.lang,
		igState: state.ig.connectAndFollow
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onConnectSubmit: (username, pw, action) => {
			dispatch(connectInstagram(username, pw, action));
		},
		onConnectSuccess: () => {
			dispatch(obtainIgInfo());
		}
	}
}

const ConnectIgModal = ({trigger, langState, igState, onConnectSubmit, onConnectSuccess}) => {

	let onFormSubmit = (event) => {
		event.preventDefault();
		var username = event.target.elements[0].value;
		var pw = event.target.elements[1].value;
		let action = 'inital';
		onConnectSubmit(username, pw, action);
	}	

	let message = () => {
		if(igState.loginResult == 'success'){
			setTimeout(onConnectSuccess, 2000);
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
		      <Icon name='checkmark' /> Connect
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
					      <Icon name='checkmark' /> Connect
					    </Button>
	  				 </Form> 
    	}
	}

	return(
	<Modal trigger={trigger} closeIcon='close' size='small' dimmer='blurring'>
	  <Header icon='instagram' content='Connect to Instagram' />
	  <Modal.Content>
	  { message() }
	  </Modal.Content>
	</Modal>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectIgModal);

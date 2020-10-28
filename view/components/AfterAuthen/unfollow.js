import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';
import { Segment, Button, Header, Message, Icon, Divider, Container, Image, Modal } from 'semantic-ui-react';
import { checkRunningCampaign } from '../../../core/instagram/actions';
import { imedUnfollow } from '../../../core/instagram/unfollow_actions';
import { getUnfollowLeft } from '../../../core/instagram/history/actions';
import { submitMessage } from './submitMessage';
import Layout from './layout';

const mapStateToProps = (state) => {
	return {
		igState: state.ig.connectAndFollow,
		countState: state.ig.history.totalCount
	}
}

class Unfollow extends React.Component{
	componentWillMount(){
		this.props.dispatch(checkRunningCampaign())
		this.props.dispatch(getUnfollowLeft())
	}

	render(){
		let {notEnded, requestStatus, currentTarget, currentService, connected} = this.props.igState
		let { unfollowLeft } = this.props.countState
		return (
			<Layout>
				<Header as='h2' style={{textAlign:'center'}}>創建新的 Auto Unfollow</Header>
				<Segment.Group>
					<Segment>
						{ submitMessage(notEnded, requestStatus, currentTarget, currentService) }
					</Segment>
					<Segment>
						<Header as='h3'>請選擇一種取消追蹤的範圍</Header>
						<p>小提示：開始前你應該最少有600追蹤數量</p>
					</Segment>
					<Divider section/>
					<Segment>
						<Header as='h4'>取消追蹤所有你追蹤中的用戶(all followings) :</Header>
						<Modal 
						trigger={<Button color='green' disabled={notEnded || requestStatus == 'success' || !connected || requestStatus == 'sent'}
						>立即開始</Button>} closeIcon='close' size='small' dimmer={false} closeOnDocumentClick={true}> 
							<Header icon='remove user' content='自動取消追蹤' />							
							<Modal.Content>
								<div style={{textAlign: 'center'}}>
									<p>你將會取消追蹤你現在追蹤中的用戶</p>							
									<Button color='orange' disabled={notEnded || requestStatus == 'success' || !connected || requestStatus == 'sent'}
									onClick={()=>{this.props.dispatch(imedUnfollow(false))}}>確定並開始</Button>
								</div>
							</Modal.Content>
						</Modal>
					</Segment>
					<Divider horizontal>OR</Divider>
					<Segment>
						<Header as='h4'>只取消追蹤 1ForAll 幫你追蹤的用戶 :</Header>
						<Header as='h4' color='purple' icon='user outline' content={ '1ForAll 未取消追蹤數 ' + unfollowLeft } />
						<Modal
						trigger={<Button color='green' disabled={notEnded || requestStatus == 'success' || !connected || requestStatus == 'sent'}
						>立即開始</Button>} closeIcon='close' size='small' dimmer={false} closeOnDocumentClick={true}>
							<Header icon='remove user' content='自動取消追蹤' />
							<Modal.Content>
								<div style={{textAlign: 'center'}}>
									<p>你將會取消追蹤 1ForAll 幫你追蹤的用戶</p>
									<Button color='orange' disabled={notEnded || requestStatus == 'success' || !connected || requestStatus == 'sent'}
									onClick={()=>{this.props.dispatch(imedUnfollow(true))}}>確定並開始</Button>
								</div>
							</Modal.Content>
						</Modal>
					</Segment>
				</Segment.Group>
			</Layout>
		)
	}
}

export default connect(mapStateToProps)(Unfollow);
import firebase from 'firebase';
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';

import React from 'react';
import { Segment, Header, Grid, Card, Icon, Container, List, Progress, Feed, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { getFollowedUser, getCampaginInfo, clearList } from '../../../core/instagram/history/actions'
import Layout from './layout';

const ProgressBar = (props) => {
	let { followedCount } = props.campaginInfoState
	return (
		<div>
			<Header as='h4'>Progess</Header>	
			<Progress value={ followedCount ? followedCount : 0 } 
			total='600' indicating>{ followedCount ? followedCount : '0'}/600</Progress>
		</div>
	)
}

const CurrentCampagin = (props) => {
	const { startTime, target, topic, endStatus, service } = props.campaginInfoState;
	let getTopic = (topic) => {
		switch (topic) {
			case 'SPECIFIC':
				return '指定賬戶的粉絲'
			case 'LOCATION':
				return '地區中的所有用戶'
			case 'HASHTAG':
				return '以 Hashtag 識別的用戶'
			case 'UNFOLLOW':
				return '自動取消追蹤'
			default:
				return 'Loading . . .'
		}
	}
	let getStatus = (end, pause) => {
		if (end) {
			return '完成'
		} else if (pause) {
			return '暫停'
		} else {
			return '工作中'
		}
	}

	let getTarget = (target) => {
		switch(target){
			case true:
				return '1ForAll幫你追蹤的用戶'
			case false:
				return '所有你追蹤中的用戶'
			default:
				return target
		}
	}

	return (
		<Grid.Column width='8'>
			<Card color='blue'>
				<Card.Content><Header as='h4' color='blue'>方式：{getTopic(topic || service)}</Header></Card.Content>
				<Card.Content>
					<List>
						<List.Item icon='crosshairs' content={'目標：' + ( target !== undefined ? getTarget(target)  : 'Loading . . .') }/>
						<List.Item icon='time' content={'開始：' + (startTime? startTime: 'Loading . . .')}/>
						<List.Item icon='hourglass half' content={'狀況：' + (service ? getStatus(endStatus) : '未設定工作')}/>
					</List>
				</Card.Content>
			</Card>
			<ProgressBar campaginInfoState={props.campaginInfoState}/>
		</Grid.Column>
	)
}



const FollowedList = (props) => {

	const generateList = (array) => {
		if(array.length >= 1){
			return array.map(item =>  {
				return (
					<Feed.Event key={item.userName}>
					  <Feed.Label image={item.userPicture} />
					  <Feed.Content>
					        <Feed.Date style={{fontSize:'0.8em'}}>{item.followTime}</Feed.Date>
					        <Feed.Summary>
					          	<a href={'https://www.instagram.com/' + item.userName}> {item.userName} </a>
					        </Feed.Summary>

					  </Feed.Content>
					</Feed.Event>
				)
			} )
		} else {
			return 'Loading . . . '
		}
	}

	const checkDbData = (dbData) => {
		if(dbData){
			return generateList(dbData)
		} else {
			return 'Loading . . . '
		}
	}

	const listTitle = (data) => {
		switch(data){
			case 'FOLLOW':
				return '最近 100 追蹤'
			case 'UNFOLLOW':
				return '最近 100 取消追蹤'
			default:
				return '未有最新活動紀錄'	
		}
	}

	return (
		<Grid.Column width='8'>
			<Card color='teal'>
			<Card.Content>
				<Card.Header >
					{ listTitle(props.service) }<Icon name='users' color='teal'/>
				</Card.Header>
		    </Card.Content>
		    <Card.Content style={{ height: 300, overflowY: 'scroll' }}>
		    	<Feed size='large'>
		    	{checkDbData(props.followedState)}
				</Feed>
			</Card.Content>
			</Card>
		</Grid.Column>
	)
}

const mapStateToProps = (state) => {
	const { followedList, campaginInfo } = state.ig.history
	return {
		followedState: followedList, 
		campaginInfoState: campaginInfo		
	}
}

class accountHome extends React.Component {
	componentDidMount () {
		let userId = firebaseAuthen.currentUser.uid;
		this._firebaseInfoRef = firebasedb.ref('users/' + userId + '/latestCampagin');
		this._firebaseInfoRef.on('value', (snapshot) => {
			if(snapshot.val()){
				let { topic, startTime, ended, service } = snapshot.val() ;
				let target = snapshot.val().targetUser || snapshot.val().targetedLocation || snapshot.val().targetHashtag || snapshot.val().onlyWeFollowed;
				let count = snapshot.val().followedCount || snapshot.val().unfollowedCount ;
				this.props.dispatch(getCampaginInfo(topic, startTime, target, count, ended, service));
			}
		})

		this._firebaseFollowedRef = firebasedb.ref('users/' + userId + '/latestCampagin/followed').limitToLast(100);
		this._firebaseFollowedRef.on('child_added', (snapshot) => {
			let { time, userName, picture } = snapshot.val()
			this.props.dispatch(getFollowedUser(time, userName, picture));
		})
	} 
	  
	componentWillUnmount () {
		this.props.dispatch(clearList());
    	this._firebaseInfoRef.off();
    	this._firebaseFollowedRef.off();
  	}

	render(){
		const { followedState, campaginInfoState } = this.props
		return (
			<Layout>
				<Header as='h2' style={{textAlign:'center'}}>用戶主頁</Header>
				<Segment.Group>
					<Container fluid>
					<Header as='h3' style={{marginLeft: '3px', marginTop: '10px'}}> { !campaginInfoState.service ? '沒有' : ''}正在工作的機械人<Icon name='android' color='blue'/></Header>
						<Grid stackable columns={2} relaxed centered={true}>
							<CurrentCampagin dispatch={this.props.dispatch} campaginInfoState={campaginInfoState}/>
							<FollowedList service={campaginInfoState.service} dispatch={this.props.dispatch} followedState={followedState}/>
						</Grid>
					<Divider section />	
					</Container>
				</Segment.Group>
			</Layout>
		)
	}
}

export default connect(mapStateToProps)(accountHome);
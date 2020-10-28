import React from 'react';
import Layout from '../layout';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../../core/firebase/config';
import { totalFollowCount, selectOneCampagin,
 	getFollowedUser, followBackList, clearList, onChangePage } from '../../../../core/instagram/history/actions';
import { List, Button, Item, Segment, Header, Card, Icon, Grid, Container, Feed, Statistic, Visibility } from 'semantic-ui-react';
import { Doughnut } from 'react-chartjs-2';
import Pagination from 'react-js-pagination';

const SelectedCampagin = (props) => {
	const { histStart, histTarget, histTopic, histEnd, histService } = props.campaginInfoState;
	let getTopic = (topic) => {
		switch (topic || histService) {
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
		<Grid.Column width='5'>
			<Card color='blue'>
				<Card.Content><Header as='h4' color='green'><Icon name='crosshairs'/>{ histTarget !== null ? getTarget(histTarget)  : 'Loading . . .'}</Header></Card.Content>
				<Card.Content>
					<List>
						<List.Item icon='search' content={'方式：' + getTopic(histTopic)}/>
						<List.Item icon='hourglass start' content={'開始：' + (histStart? histStart: 'Loading . . .')}/>
						<List.Item icon='hourglass end' content={'完成：' + (histEnd? histEnd: 'Loading . . .')}/>
					</List>
				</Card.Content>
			</Card>
			<div style={{textAlign:'center'}}>
				{ histService == 'FOLLOW' ? <Statistic size='small' label='成功率' value={props.stat + '%'} color='blue' /> : ''}
			</div>
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
					        <Feed.Date style={{fontSize:'0.8em'}}>{item.followTime ? item.followTime : ''}</Feed.Date>
					        <Feed.Summary>
					          	<a href={'https://www.instagram.com/' + item.userName}> {item.userName} </a>
					        </Feed.Summary>

					  </Feed.Content>
					</Feed.Event>
				)
			} )
		} else {
			return 'Loading . . .'
		}
	}

	const checkDbData = (dbData) => {
		if(dbData){
			return generateList(dbData)
		} else {
			return 'Loading . . . '
		}
	} 

	return (
		<Grid.Column width='5'>
			<Card color='teal'>
			<Card.Content>
				<Card.Header>
					{props.title.word} <Icon name={props.title.icon} color={props.title.color}/>
				</Card.Header>
		    </Card.Content>
		    <Card.Content style={{ height: 300, overflowY: 'scroll' }}>
		    	<Feed size='large'>
		    	{checkDbData(props.followedState)}
				</Feed>
			</Card.Content>
			</Card>
			{ props.listType == 'followed' ? <Pagination
			  hideDisabled
		      activePage={props.activePage}
		      itemsCountPerPage={50}
		      totalItemsCount={600}
		      pageRangeDisplayed={4}
		      onChange={props.onPageClick}
		    /> : ''}
		</Grid.Column>
	)
}

const mapStateToProps = (state) => {
	let { campaginInfo, followedList } = state.ig.history
	return {
		campaginInfoState: campaginInfo,
		allFollowingList : followedList
	}
}

class HistoryCampagin extends React.Component {
	componentWillMount(){
		let userId = firebaseAuthen.currentUser.uid;
		let key = this.props.campaginInfoState.key || this.props.match.params.id;
		if(!this.props.campaginInfoState.key){
			let infoRef = firebasedb.ref('users/' + userId + '/historyCampagin/' + key)
			infoRef.once('value')
			.then(snapshot => {
				let { startTime, endTime, service, topic } = snapshot.val()
				let target = snapshot.val().targetedLocation || snapshot.val().targetUser || snapshot.val().targetHashtag || snapshot.val().onlyWeFollowed;
				let getTime = (time) => {
					let followTime = new Date(time);
					let dd = (followTime.getDate() < 10) ? '0'+ followTime.getDate() : followTime.getDate() ;
					let mm = (followTime.getMonth()+1 < 10) ? ('0'+ (followTime.getMonth()+1)) : (followTime.getMonth()+1) ; //January is 0!
					let yyyy = followTime.getFullYear();
					let hh = followTime.getHours();
					let min = (followTime.getMinutes() < 10) ? ('0' + followTime.getMinutes()) : followTime.getMinutes() ;
					return (hh + ':' + min + ' - ' + dd + '/' + mm + '/' + yyyy);
				};

				this.props.dispatch(selectOneCampagin(key, startTime, getTime(endTime), service, topic, target))
			})
		}

		this.props.dispatch(onChangePage(1, key));

		let followbackRef = firebasedb.ref('users/' + userId + '/historyCampagin/' + key + '/followed')
		followbackRef.once('value')
		.then(snapshot => {
			snapshot.forEach(child => {
				let {followedBack, picture, time, userName} = child.val()
			 	if(followedBack){
					this.props.dispatch(followBackList(userName, picture))
				}
			})
		})
		//this.props.dispatch(selectOneCampagin(key, start, end, service, topic, target))
	}

	componentWillUnmount(){
		this.props.dispatch(clearList());
	}

	render(){
		let { campaginInfoState, allFollowingList, dispatch } = this.props
		let chartData = {
			labels: ['追蹤的用戶', '新的粉絲'],
			datasets: [{
				data: [600, campaginInfoState.followBackList.length],
				 backgroundColor: [
					'#2199D1',
					'#49DCB1'
            	],
            	hoverBackgroundColor: [
					'#1D84B5',
					'#49BEAA'
            	]
			}]
		};

		let onPageClick = (pageNumber) => {
			let key = campaginInfoState.key || this.props.match.params.id;

			dispatch(onChangePage(pageNumber, key))
		}

		let stat = Math.round((campaginInfoState.followBackList.length/600)*100) ;
		return (
			<Layout>
			<Header as='h2' style={{textAlign:'center'}}>個別分析</Header>
			<Grid stackable columns={1} centered={true} style={{marginTop:'30px', marginBottom:'30px'}}>
				{ campaginInfoState.histService == 'FOLLOW' ?
					<Doughnut data={chartData} options={{responsive: false}} width={292 }height={280}/> : ''}
			</Grid>
			<Grid stackable columns={2} centered={true}>
				<SelectedCampagin campaginInfoState={campaginInfoState} stat={stat}/>
				{ campaginInfoState.histService == 'FOLLOW' ?
					<FollowedList listType='followBack' title={{word: '新的粉絲', icon: 'like', color:'red'}} followedState={campaginInfoState.followBackList}/> : '' }
				<FollowedList listType='followed' title={{word: campaginInfoState.histService == 'FOLLOW' ? '已追蹤的用戶' : '已取消追蹤的用戶',
				 icon: 'users', color:'teal'}} onPageClick={onPageClick} followedState={allFollowingList} activePage={campaginInfoState.page}/>
			</Grid>
			</Layout>
		)
	}
}

export default connect(mapStateToProps)(HistoryCampagin);
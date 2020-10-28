import React from 'react';
import Layout from '../layout';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../../core/firebase/config';
import { totalFollowCount, totalUnfollowCount, selectOneCampagin,
	getHistoryCompagin, clearList, selectedCampagin } from '../../../../core/instagram/history/actions';
import { Button, Item, Segment, Header, Divider, Icon, Statistic, Container } from 'semantic-ui-react';

const HistoryCampaginList = ({historyCampgainList, dispatch}) => {
	let getTopic = (topic) => {
		switch (topic) {
			case 'SPECIFIC':
				return '指定賬戶的粉絲'
			case 'LOCATION':
				return '地區中的所有用戶'
			case 'HASHTAG':
				return '以 Hashtag 識別的用戶'
			default:
				return '取消追蹤 unfollow'
		}
	}

	let getTarget = (target) => {
		switch(target){
			case true:
				return '取消追蹤 follow'
			case false:
				return '取消追蹤 unfollow'
			default:
				return target
		}
	}

	let viewDetailClick = (key, start, end, service, topic, target) => {
		if(service == 'FOLLOW'){
			dispatch(selectedCampagin(key, start, end, service, topic, target))
		} else {
			dispatch(selectOneCampagin(key, start, end, service, topic, target))
		}
	}

	return (
		<Segment.Group style={{ maxHeight: 500, overflowY: 'scroll' }}>
			<Container style={{marginTop: '20px', marginBottom: '20px'}}>
				<Item.Group divided relaxed>
					{historyCampgainList.map(campagin => {
						let { id, key, start, end, service, topic, target } = campagin;
						return <Item key={id}>
							      <Item.Content>
							        <Item.Header>{ target !== null ? getTarget(target)  : 'Loading . . .'}</Item.Header>
							        <Item.Meta>{getTopic(topic)}</Item.Meta>
							        <Item.Description> 開始時間: {start} <br/> 完成時間: {end}</Item.Description>
							         <Link to={`/account/dashboard/campagin/${key}`}>
								         <Button basic primary size='small' 
								         onClick={() => {viewDetailClick(key, start, end, service, topic, target)}}>
								            View details
								            <Icon name='right chevron' />
								         </Button>
							         </Link>
							      </Item.Content>
						       </Item>
					})}
				</Item.Group>
			</Container>
		</Segment.Group>
	)
}

const mapStatetoProps = (state) => {
	let {totalCount, historyCampgainList} = state.ig.history
	return{
		totalCount,
		historyCampgainList
	}
}

class DashboardSelection extends React.Component {
	componentWillMount(){
		let userId = firebaseAuthen.currentUser.uid;	
		firebasedb.ref('users/' + userId + '/historyCampagin').once('value')
			.then(snapshot=>{
				if(snapshot.exists()){
					snapshot.forEach(child => {
						let {id, startTime, endTime, service, topic} = child.val();
						let key = child.key;
						let target = child.val().targetedLocation || child.val().targetUser || child.val().targetHashtag || child.val().onlyWeFollowed ;
						this.props.dispatch(getHistoryCompagin(key, id, startTime, endTime, service, topic, target))
					})
				}
			})
	}

	componentDidMount(){
		let userId = firebaseAuthen.currentUser.uid;
		this.countFollowRef = firebasedb.ref('users/' + userId + '/allFollowed')
		this.countFollowRef.on('value', snapshot => {
			if(snapshot.exists()){
				let a = snapshot.numChildren();
				this.props.dispatch(totalFollowCount(a));
			}
		})

		this.countUnfollowRef = firebasedb.ref('users/' + userId + '/totalUnfollowCount')
		this.countUnfollowRef.on('value', snapshot => {
				let a = snapshot.val();
				this.props.dispatch(totalUnfollowCount(a || 0));
		})		
	}

	componentWillUnmount(){
		this.props.dispatch(clearList());
		this.countFollowRef.off();
		this.countUnfollowRef.off();
	}

	render(){
		let { totalCount, historyCampgainList, dispatch } = this.props
		let campaginNum = () => {
			if(historyCampgainList.length == 0){
				return 	<div style={{textAlign:'center'}}>
							<p>暫時未有服務紀錄</p>
							<p>當每一個服務完結後，你可以在這裡選擇服務查閱數據</p>
						</div>
			} else { 
				return <HistoryCampaginList historyCampgainList={historyCampgainList} dispatch={dispatch}/>
			}
		}	
		return(
			<Layout>
				<Segment>
				<div style={{textAlign:'center'}}>
					<Header as='h3'>整體數據</Header>

					<Statistic size='small' color='blue'>
				      <Statistic.Value>
				        <Icon name='add user' />
				        {totalCount.totalFollow}
				      </Statistic.Value>
				      <Statistic.Label>追蹤數</Statistic.Label>
				    </Statistic>
					
					<Statistic size='small' color='purple'>
				      <Statistic.Value>
				        <Icon name='remove user' />
				        {totalCount.totalUnfollow}
				      </Statistic.Value>
				      <Statistic.Label>取消追蹤數</Statistic.Label>
				    </Statistic>
				</div>
				<Divider section />	
				<Header as='h3' style={{textAlign:'center'}}>獨立數據</Header>
				{campaginNum()}
				<Divider section />	
				<div style={{textAlign:'center'}}>
					<Link to='/account/follow'><Button color='green'>去設定新的服務</Button></Link>
				</div>
				</Segment>
			</Layout>
		)
	}
}

export default connect(mapStatetoProps)(DashboardSelection);
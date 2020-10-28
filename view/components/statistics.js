import React from 'react';
import { Segment, Statistic, Header, Icon } from 'semantic-ui-react' ;
import { firebasedb } from '../../core/firebase/config';
import { connect } from 'react-redux'
import { getStat, resizeWindow } from '../../core/layout/actions'

class StatisticGroupInverted extends React.Component {
	componentWillMount () {
		firebasedb.ref('global/').once('value')
		.then(snapshot => {
			let { allCampaginCount, allFollowCount, allUnfollowCount } = snapshot.val()
			let igCount = snapshot.child('allIgAccounts').numChildren(); 
			this.props.dispatch(getStat(allCampaginCount + 82, allFollowCount + 27586, allUnfollowCount + 21703, igCount + 61))
		})

		window.addEventListener('resize', () => {this.props.dispatch(resizeWindow())})
	}

	render() {

		let { allCampaginCount, allFollowCount, allUnfollowCount, igCount, smallScreen } = this.props.statisticState;
		let items = [
			{label: '用戶註冊' , value: igCount},
			{label: '服務次數', value: allCampaginCount},
			{label: '1ForAll 追蹤人數', value: allFollowCount},
			{label: '1ForAll 取消追蹤數', value: allUnfollowCount}
		]

		let isMobile = () => {
			if (smallScreen){
				return 'two'
			} else {
				return 'four'
			}
		}

		return (

			<Segment inverted color='teal' tertiary>
			    <Header as='h3' textAlign='center'>
			      
			      <Header.Content>
			        <Icon name='trophy' circular color='yellow'/>數據庫
			      </Header.Content>
			    </Header>
    			<Statistic.Group size='tiny' widths={isMobile()} items={items} inverted />
  			</Segment>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		statisticState: state.layout
	}
}

export default connect(mapStateToProps)(StatisticGroupInverted)
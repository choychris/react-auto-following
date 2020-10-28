import React from 'react';
import { Button } from 'semantic-ui-react';

const ExtraSetting = () => {
	return ( 
		<div>
			<Divider section />
			<Header as='h3'>進階選項(optional): </Header>
			<div style={{marginTop: '10px'}}>
				<Button basic color='blue'>設定取消追蹤(Unfollow)</Button>
			</div>
			<div style={{marginTop: '10px', marginBottom: '10px'}}>
				<Button basic color='blue'>設定黑名單</Button>
			</div>
		</div>
	)
}
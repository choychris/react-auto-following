import React from 'react';
import { Message, Icon, Image } from 'semantic-ui-react';

export const submitMessage = (notEnded, requestStatus, currentTarget, currentService) => {
	let checkFollow = (currentService) => {
		if (currentService == 'FOLLOW') {
			return (
				<div>
					<Message.Header>自動追蹤正在進行中</Message.Header>目標定義： {currentTarget}
				</div>
			)
		} else {
			return <Message.Header>自動取消追蹤正在進行中</Message.Header>
		}
	}

	if(requestStatus == 'success' || notEnded) {
		return (<Message info icon> 
			<Icon name='plug' />
			<Message.Content>
			{ checkFollow(currentService) }
			</Message.Content>
			</Message>
		)
	} else if (requestStatus == 'sent') {
		return ( <Message icon>
		    <Icon name='circle notched' loading />
		    <Message.Content>
		      <Message.Header>請稍候片刻</Message.Header>
		      正在為你設定自動工作機械人
		    </Message.Content>
		  	</Message>
		)
	} else if (requestStatus == 'error') {
		return <Message error header='創建失敗' content='請重新嘗試或聯絡我們提供協助 support@1forall.shop'/>
	} else if (requestStatus == 'not_found') {
		return <Message error header='創建失敗' content='未能找到此Instagram用戶，請檢查並重新嘗試'/>
	} else if (requestStatus == 'forbidden') {
		return 	<Message error>
					<div style={{textAlign:'center'}}>
						未能創建 ， 請先開啟Instagram app 確認 "這是我" (It was me)， 然後再嘗試一次 
					</div>	
					<Image src={'/src/assets/itwasme.jpeg'} size='small' centered/>
				</Message>
	}
}
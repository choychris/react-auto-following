import Dropin from 'braintree-web-drop-in';
import React from 'react';
import { getClientToken, enterDays, getInstance, sendPaymentNonceToServer } from '../../../core/brainTree/actions';
import { connect } from 'react-redux'
import { Button, Modal, Input, Icon, Form, Label, Grid, Header, Statistic, Container } from 'semantic-ui-react';
import 'whatwg-fetch';
const api_host = process.env.NODE_ENV == 'production'? 'https://api.1forall.shop' : 'http://localhost:3000';

const mapStateToProps = (state) => {
  return {
    paymentState: state.brainTree
  }
}


class Payment extends React.Component {

componentWillMount () {
    this.props.dispatch(getClientToken());
}

  render(){
    let { clientToken, price, days, instance } = this.props.paymentState;
    let { dispatch } = this.props

    const enterTimes = (e) => {
      e.preventDefault();
      let days = e.target.value;
      dispatch(enterDays(days));
    }

    return(
        <div>
        <Header icon='shopping basket' content='購買服務次數'/>
        
        <Grid container divided stackable columns={2} style={{marginBottom: '14px'}}>
            <Grid.Row>
            <Grid.Column>
              <div>
                <label>請輸入需要購買的服務次數</label>
              </div>
              <Label basic color='orange' pointing='below'>一次購買多於 5 次 9 折，多於 10 次 8 折！</Label>
              <div>
                <Input icon='plug' iconPosition='left' type='number' min='1' placeholder='服務次數' onChange={enterTimes}/>
              </div>
              
            </Grid.Column>
            <Grid.Column>
              <Header as='h3' content='將要購買：'/>
              <div>
              <Statistic size='tiny' label='次服務' value={days || 1} horizontal/>
              </div>
                <Statistic size='tiny' label='HKD' value={'$' + price || 20} horizontal/>
            </Grid.Column>
            </Grid.Row>
        </Grid>
        
        <Modal trigger={<Button color='green'><Icon name='checkmark'/>購買</Button>}>
          <Header textAlign='center'>{"購買 " + days + ' 次服務，支付 HKD ' + price +'.00'}</Header>
          <Modal.Content>
             <div style={{textAlign: 'center'}}>
              {instance ? '' : '請耐心等待直到付款方式加戴完成'}
             </div>
             <DropinComponent price={price} dispatch={dispatch} clientToken={clientToken}/>
             <div style={{textAlign: 'center', marginTop:'28px'}}>
              <Button color='blue' onClick={()=>{dispatch(sendPaymentNonceToServer(instance, price))}}><Icon name='checkmark'/>確認付款</Button>
             </div>
          </Modal.Content>
        </Modal>
       </div>

      )
  }
}

class DropinComponent extends React.Component {
  componentWillMount(){
      let { dispatch } = this.props
      Dropin.create(
            {
              authorization: this.props.clientToken,
              container: '#dropin-container',
              locale: 'zh_HK',
              paypal: {
                flow: 'checkout',
                amount: `${this.props.price}.00`,
                currency: 'HKD'
              }
            }, 
            function (err, dropinInstance) {
              if (err) {
                // Handle any errors that might've occurred when creating Drop-in
                console.error(err);
                return;
              }
              dispatch(getInstance(dropinInstance));
          }
        )
  }
  render(){
    return <div id='dropin-container'></div>
  }
}





export default connect(mapStateToProps)(Payment);
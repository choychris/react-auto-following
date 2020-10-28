// ============================ libraries import ===============================
import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Dimmer, Popup, Form} from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// ============================ actions import =================================
import { resizeWindow, toggleSideBar, feedbackSubmit } from '../../../core/layout/actions';
import { signOut } from '../../../core/auth/email/actions';
import { obtainIgInfo, disconnectIg } from '../../../core/instagram/actions';

// ============================ component import ===============================
import ConnectIgModal from './connectIgModal';

// ============================== firebase import ==============================
import { firebaseAuthen, firebaseApp, firebasedb } from '../../../core/firebase/config';

let LinkActiveStyle = {
    backgroundColor: 'rgba(118, 118, 118, 0.3)',
    marginTop: '10px',
    paddingTop: '5px',
    paddingLeft: '1em',
    paddingRight: '1em',
    paddingBottom: '5px',
}


const mapStateToProps = (state) => {
  return {
    layoutState: state.layout,
    authenState: state.auth,
    langState: state.lang,
    igState: state.ig.connectAndFollow
  }
}

const mapDispatchToProps = (dispatch) => {
  let resizer
  return {
    onWindowSizeChange: () => {
      clearTimeout(resizer);
      resizer = setTimeout(() => dispatch(resizeWindow()), 100);
    },
    onToggleSideBar: () => {
      dispatch(toggleSideBar());
    },
    onSignOutSubmit: () => {
      dispatch(signOut());
      dispatch(disconnectIg());
    },
    onLayOutLoad: () => {
      dispatch(obtainIgInfo());
    },
    onFeedbackSubmit : () => {
      dispatch(feedbackSubmit());
    }
  }
}

class Layout extends React.Component {

componentWillMount () {
  if(firebaseAuthen.currentUser){
    this.props.onLayOutLoad();
  }
  window.addEventListener('resize', this.props.onWindowSizeChange)
} 

render() {
    let toggleButton = () => {
      if(this.props.layoutState.isMobile) {
        return (
          <span className="navicon" onClick={this.props.onToggleSideBar}>
            <Icon name="content" />
          </span>
        )
      }
    };

    let checkIgConnect = () => {
      if (this.props.igState.connected){
        return <Menu.Item> <Link to={'/account'}> <Menu.Header>
        <img src={this.props.igState.picture} style={{width:'40px', height:'40px', borderRadius:'40px'}}/>
        </Menu.Header>
        { this.props.igState.username } </Link> </Menu.Item>
      } else {
        return <ConnectIgModal trigger={<Menu.Item>
               <Icon name='instagram'/> Connect to Instagram Account
               </Menu.Item>} />
      }
    }

    let showDimmer = () => {
      if(this.props.layoutState.isMobile && this.props.layoutState.sideBarVisible){
        return (<Dimmer active={true} onClick={this.props.onToggleSideBar}/>)
      }
    };

    let submitFeedback = (event) => {
      event.preventDefault();
      const name = event.target.elements[0].value;
      const email = event.target.elements[1].value;
      const feedback = event.target.elements[2].value;

      firebasedb.ref('global/feedbacks').push({name, email, feedback})
      this.props.onFeedbackSubmit();

      event.target.elements[0].value = '';
      event.target.elements[1].value = '';
      event.target.elements[2].value = '';
    }

    if (!this.props.authenState.authenticated){
      return <Redirect to={{pathname:'/login'}} />
    } else {
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className='navbar-header' style={{paddingTop: '10px'}} >
              { toggleButton() }
              <Link to="/"><img className='logo' src='/src/assets/Logo_V3.png'/></Link>
               <span style={{float:'right', marginTop: '17px', marginLeft: '25px', marginRight: '15px'}}>
                  <Link to={'/account'} style={{fontSize: '16px', color: '#FFFFFF'}}>用戶主頁</Link>
               </span>
           </div>
          </div>
        </nav>
        
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='push' width='thin' visible={this.props.layoutState.sideBarVisible} icon='labeled' pointing inverted vertical>
            { checkIgConnect() }
            <Menu.Item>
              <Icon name='tags'/>
              <Menu.Header>New Service</Menu.Header>
              <Menu.Menu>
                <Menu.Item>
                <NavLink activeStyle={LinkActiveStyle} to='/account/follow'>Auto Follow</NavLink>
                </Menu.Item>
                <Menu.Item>
                <NavLink activeStyle={LinkActiveStyle} to='/account/unfollow'>Auto Unfollow</NavLink>
                </Menu.Item>                
                <Popup trigger={<Menu.Item> Auto Like</Menu.Item>} content='Coming soon' position='right center' size='mini'/>
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item >
              <Icon name='line chart' />
              <Menu.Header>Dashboard</Menu.Header>
              <Menu.Menu>
                <Menu.Item>
                <NavLink activeStyle={LinkActiveStyle} to='/account/dashboard'>All Reocrds</NavLink>
                </Menu.Item>              
                <Popup trigger={<Menu.Item> Comparison </Menu.Item>} content='Coming soon' position='right center' size='mini'/>
              </Menu.Menu>
            </Menu.Item>
            <Menu.Item name='user'>
              <Icon name='user' />
              <NavLink activeStyle={LinkActiveStyle} to='/account/profile'>Profile Setting</NavLink>
            </Menu.Item>            
            <Menu.Item name='faq'>
              <Icon name='help circle outline' />
              FAQ
            </Menu.Item>            
            <Menu.Item name='logout' onClick={this.props.onSignOutSubmit}>
              Logout
            </Menu.Item>
          </Sidebar>
          
          <Sidebar.Pusher>
           <div style={this.props.layoutState.isMobile ? null: {maxWidth: (window.innerWidth - 150)} }>
            <Segment basic>
              {this.props.children}
            </Segment>
            <Segment.Group style={{marginTop: '80px'}}>
              <Segment>
              <Header as='h4'>{this.props.layoutState.feedback ? '意見已發出，謝謝！' : '對我們來說，你的意見很寶貴。歡迎提出任何意見及問題'}</Header>
                <Form size='tiny' onSubmit={submitFeedback}>
                  <Form.Group widths='equal'>
                    <Form.Field>
                      <Form.Input label='你的名字' placeholder='Name' />               
                      <Form.Input label='你的電郵' placeholder='Email address' /> 
                    </Form.Field>
                    <Form.TextArea widths='16' label='意見及問題' placeholder='Tell us more your thoughts . . .'/>
                  </Form.Group>  
                  <Button type='submit' color='blue'>Submit</Button>
                </Form>
                <Header as='h4'>或聯絡我們 : 
                  <div>  <Icon name='phone' size='large'/>852-5336-9632</div>  
                  <div>  <Icon name='mail outline' size='large'/>support@1forall.shop</div>
                </Header>
              </Segment>
            </Segment.Group>
            { showDimmer() }
           </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
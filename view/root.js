import React from 'react';
import { PropTypes } from 'prop-types';
import { BrowserRouter as Router, Route, IndexRoute, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Register from './components/register';
import Login from './components/login';
import ResetPassword from './components/resetpassword';
import HomePage from './components/static/homePage';
import Features from './components/static/features';
import Pricing from './components/static/pricing';
import ScrollToTop from './components/ScrollToTop';
import Thanks from './components/thanks';
import AutoFollow from './components/AfterAuthen/autofollow';
import AccountHome from './components/AfterAuthen/accountHome';
import Profile from './components/AfterAuthen/profile';
import DashboardSelection from './components/AfterAuthen/dashboard/selection';
import HistoryCampagin from './components/AfterAuthen/dashboard/campagin';
import Unfollow from './components/AfterAuthen/unfollow';




const Root = ({ history, store }) => {
 	return (
		<Provider store={store} >
			<Router>
				<ScrollToTop>
					<Switch>
						<Route exact path="/" component={HomePage} />
						<Route path="/features" component={Features} />
						<Route path="/pricing" component={Pricing} />					
						<Route path="/register" component={Register} />
						<Route path="/thank-you" component={Thanks} />
						<Route path="/login" component={Login} />
						<Route path="/resetpassword" component={ResetPassword} />
						<Route exact path="/account" component={AccountHome} />
						<Route strict path="/account/follow" component={AutoFollow}/>
						<Route strict path="/account/unfollow" component={Unfollow}/>
						<Route strict path="/account/profile" component={Profile}/>
						<Route strict exact path="/account/dashboard" component={DashboardSelection}/>
						<Route strict path="/account/dashboard/campagin/:id" component={HistoryCampagin}/>
						<Route path='*' component={HomePage} />
					</Switch>
				</ScrollToTop>
			 </Router>
		</Provider> 
	);	
};



Root.propTypes = {
	store: PropTypes.object.isRequired,
};

export default Root;


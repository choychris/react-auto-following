import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from './rootReducer';


let middleware = [ thunk ];
if (process.env.NODE_ENV == 'development') {
  const logger = createLogger();
  middleware = [ ...middleware, logger ]
}

const store = createStore(rootReducer, {}, applyMiddleware(...middleware));

export default store;
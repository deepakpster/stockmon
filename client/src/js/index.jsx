// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';
import Dashboard from './containers/Dashboard';
import '../scss/main.scss';

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<Switch>
				<Route exact path="/" component={Dashboard} />
				<Route component={Dashboard} />
			</Switch>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('app'),
);

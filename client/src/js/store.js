// @flow

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import * as stores from './stores';
import setupSocket from './sockets'

export const history = createHistory();

export const store = createStore(
	combineReducers({ ...stores, router: routerReducer }),
	applyMiddleware(thunkMiddleware, routerMiddleware(history)),
);

export const socket = setupSocket(store.dispatch);
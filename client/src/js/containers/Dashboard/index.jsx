// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { dashboardActions } from './../../actions';
import Nifty50Gainers from './../../components/NSEViews/nifty50Gainers';
import styles from './styles.scss';


class Dashboard extends React.Component {
	componentDidMount(){
		const {fetchStockDetail} = this.props.actions;
		// fetchStockDetail('NSE:YESBANK');
		// setInterval(()=>{
		// 	fetchStockDetail('NSE:YESBANK');
		// }, 900000)
	}
  render() {
		const {stocks} = this.props.dashboardState;
		return (
			<div>
				My Stocks Monitor
				<Nifty50Gainers {...this.props}/>
				<pre>
					{JSON.stringify(stocks)}
				</pre>
			</div>
		)
	}
}

export default withRouter(connect(
	(state, props) => ({
		dashboardState: state.dashboardState,
		...props,
	}),
	(dispatch => ({
		actions: bindActionCreators(dashboardActions, dispatch)
	})),
)(Dashboard));
// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { dashboardActions } from './../../actions';
import Nifty50Gainers from './../../components/NSEViews/nifty50Gainers';
import MarketWatchTable from './../../components/Zerodha/MarketWatchTable';
import styles from './styles.scss';


class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			zCookie: ''
		};
		this.loginViaZerodha = this.loginViaZerodha.bind(this);
		this.setCookie = this.setCookie.bind(this);
	}
	componentDidMount(){
		const {fetchStockDetail} = this.props.actions;
		// fetchStockDetail('NSE:YESBANK');
		// setInterval(()=>{
		// 	fetchStockDetail('NSE:YESBANK');
		// }, 900000)
	}
	loginViaZerodha() {
		const {login} = this.props.actions;
		const {zCookie} = this.state;
		const cookies = {};
		zCookie.split('; ').map(pair=>{
			const keyValue = pair.split('=');
			cookies[keyValue[0]] = keyValue[1];
			return pair;
		});
		login(zCookie, cookies['public_token']);
	}
	setCookie(eOpts){
		this.setState({
			zCookie: eOpts.target.value
		})
	}
  render() {
		const {stocks, marketWatchStocks} = this.props.dashboardState;
		const {zCookie} = this.state;
		console.log('marketWatchStocks', marketWatchStocks);
		return (
			<div className={styles.dashboard}>
				<div className={styles.title}>
					<span>My Stocks Monitor</span>
				</div>
				<div className={styles.loginContainer}>
					<input placeholder={`Feed me the cookie`} value={zCookie} onChange={this.setCookie} type="text"></input>
					<span className={`button`} onClick={this.loginViaZerodha}>Set Cookies</span>
				</div>
				<MarketWatchTable store={marketWatchStocks} />
				{/* <Nifty50Gainers {...this.props}/> */}
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
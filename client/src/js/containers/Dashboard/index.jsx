// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { dashboardActions } from './../../actions';
import Nifty50Gainers from './../../components/NSEViews/nifty50Gainers';
import MarketWatchTable from './../../components/Zerodha/MarketWatchTable';
import HoldingsTable from './../../components/Zerodha/HoldingsTable';
import OrdersTable from './../../components/Zerodha/OrdersTable';
import PositionsView from './../../components/Zerodha/PositionsView';
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
		const {stocks, marketWatchStocks, holdings, positions, orders} = this.props.dashboardState;
		const {zCookie} = this.state;
		return (
			<div className={styles.dashboard}>
				<div className={styles.title}>
					<span>Stocks Monster</span>
				</div>
				<div className={styles.loginContainer}>
					<input placeholder={`Feed me the cookie`} value={zCookie} onChange={this.setCookie} type="text"></input>
					<span className={`button`} onClick={this.loginViaZerodha}>Set Cookies</span>
				</div>
				<div>
					<div className={styles.marketwatchcont}>
						<MarketWatchTable store={marketWatchStocks} />
					</div>
					<div className={styles.holdPosContainer}>
						<div className={styles.column}>
							<div className={styles.holdings}>
								<span>Holdings</span>
								<HoldingsTable store={holdings} />
							</div>
							<div className={styles.positions}>
								<span>Positions</span>
								<PositionsView store={positions} />
							</div>
						</div>
						<div className={styles.column}>
							<div className={styles.orders}>
								<span>Orders</span>
								<OrdersTable store={orders} />
							</div>
						</div>
					</div>
				</div>
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
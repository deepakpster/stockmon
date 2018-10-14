// @flow
import React from 'react';
import TableView from './tableView';
import styles from './styles.scss';

export default class Nifty50Gainers extends React.Component {
  componentDidMount() {
    const {fetchNifty50Gainers} = this.props.actions;
		fetchNifty50Gainers();
  }
  render() {
    const {nifty50Gainers} = this.props.dashboardState;
    console.log('nifty50Gainers::view', nifty50Gainers)
    return (
      <div>
        <span>
          {`Nifty 50 Gainers ${nifty50Gainers && nifty50Gainers.time}`}
        </span>
        <div>
          <TableView store={nifty50Gainers}/>
				</div>
      </div>
    );
  }
}
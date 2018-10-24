// @flow
import React from 'react';
import styles from './styles.scss';

export default class MarketWatchTable extends React.Component {
  render() {
    console.log('store', this.props.store)
    const {store} = this.props;
    console.log('')
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Weight</th>
            <th>id</th>
            <th>Symbol</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>LTP</th>
            <th>ATP</th>
            <th>Close</th>
            <th>Segment</th>
          </tr>
        </thead>
        <tbody>
          {
            store && store.map(stock=>{
              const {
                id, weight, tradingsymbol, last_price, segment, open, high, low, close, stop_loss
              } = stock;
              return (
                <tr key={`${tradingsymbol}-${id}`}>
                  <td>{weight}</td>
                  <td>{id}</td>
                  <td>{tradingsymbol}</td>
                  <td>{open}</td>
                  <td>{high}</td>
                  <td>{low}</td>
                  <td>{last_price}</td>
                  <td>{stop_loss}</td>
                  <td>{close}</td>
                  <td>{segment}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}
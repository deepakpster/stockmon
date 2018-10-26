// @flow
import React from 'react';
import styles from './styles.scss';

export default class TableView extends React.Component {
  render() {
    const {data} = this.props.store;
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Last Traded Price</th>
            <th>% Change</th>
            <th>Traded Qty</th>
            <th>Value (in Lakhs)</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Prev. Close</th>
            <th>Latest Ex Date</th>
          </tr>
        </thead>
        <tbody>
          {
            data && data.map(stock=>{
              const {
                highPrice, lastCorpAnnouncement, lastCorpAnnouncementDate,
                lowPrice, ltp, netPrice, openPrice, previousPrice, series,
                symbol, tradedQuantity, turnoverInLakhs
              } = stock;
              return (
                <tr key={`${symbol}-${ltp}`}>
                  <td>{symbol}</td>
                  <td>{ltp}</td>
                  <td>{netPrice}</td>
                  <td>{tradedQuantity}</td>
                  <td>{turnoverInLakhs}</td>
                  <td>{openPrice}</td>
                  <td>{highPrice}</td>
                  <td>{lowPrice}</td>
                  <td>{previousPrice}</td>
                  <td>{lastCorpAnnouncementDate}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}
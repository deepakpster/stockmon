// @flow
import React from 'react';
import styles from './styles.scss';

export default class HoldingsTable extends React.Component {
  render() {
    console.log('store', this.props.store)
    const {store} = this.props;
    console.log('')
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg.cost</th>
            <th>LTP</th>
            <th>Cur.val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Coll.qty</th>
            <th>Coll.type</th>
          </tr>
        </thead>
        <tbody>
          {
            store && store.map(stock=>{
              const {
                average_price,
                close_price,
                collateral_quantity,
                collateral_type,
                day_change,
                day_change_percentage,
                exchange,
                instrument_token,
                isin,
                last_price,
                pnl,
                price,
                product,
                quantity,
                realised_quantity,
                t1_quantity,
                tradingsymbol,
              } = stock;
              const netChange = parseFloat(last_price - average_price).toFixed(2);
              const netChangePercent = parseFloat((netChange*100)/average_price).toFixed(2);

              return (
                <tr key={`${tradingsymbol}`}>
                  <td>{tradingsymbol}</td>
                  <td>{quantity}</td>
                  <td>{average_price}</td>
                  <td>{last_price}</td>
                  <td>{price}</td>
                  <td>{pnl}</td>
                  <td>{`${netChangePercent}%`}</td>
                  <td>{collateral_quantity}</td>
                  <td>{collateral_type}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}
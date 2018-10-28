// @flow
import React from 'react';
import styles from './styles.scss';

export default class HoldingsTable extends React.Component {
  render() {
    const {store} = this.props;
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Instrument</th>
            <th>Avl. Qty</th>
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
              if(t1_quantity == 0 && stock.quantity <= 0) {
                return
              }
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
              const netChangePercent = average_price ? parseFloat((netChange*100)/average_price).toFixed(2) : 0;

              return (
                <tr key={`${tradingsymbol}`}>
                  <td>{tradingsymbol}</td>
                  <td>{t1_quantity}</td>
                  <td>{quantity}</td>
                  <td>{parseFloat(average_price).toFixed(2)}</td>
                  <td>{last_price}</td>
                  <td>{price}</td>
                  <td>{parseFloat(pnl).toFixed(2)}</td>
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
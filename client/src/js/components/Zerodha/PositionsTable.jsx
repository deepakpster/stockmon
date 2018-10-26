// @flow
import React from 'react';
import styles from './styles.scss';

export default class PositionsTable extends React.Component {
  render() {
    const {store} = this.props;
    let totalPNL = 0;
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Instrument</th>
            <th>Qty</th>
            <th>Avg.cost</th>
            <th>LTP</th>
            <th>P&L</th>
            <th>Net chg.</th>
          </tr>
        </thead>
        <tbody>
          {
            
            store && store.map(stock=>{
              if(stock.quantity <= 0) {
                return
              }
              const {
                average_price,
                buy_m2m,
                buy_price,
                buy_quantity,
                buy_value,
                close_price,
                day_buy_price,
                day_buy_quantity,
                day_buy_value,
                day_sell_price,
                day_sell_quantity,
                day_sell_value,
                exchange,
                instrument_token,
                last_price,
                m2m,
                multiplier,
                overnight_quantity,
                pnl,
                product,
                quantity,
                realised,
                sell_m2m,
                sell_price,
                sell_quantity,
                sell_value,
                tradingsymbol,
                unrealised,
                value
              } = stock;
              const netChange = parseFloat(last_price - average_price).toFixed(2);
              const netChangePercent = average_price ? parseFloat((netChange*100)/average_price).toFixed(2) : 0;
              totalPNL += pnl;
              return (
                <tr key={`${tradingsymbol}`}>
                  <td>{product}</td>
                  <td>{tradingsymbol}</td>
                  <td>{quantity}</td>
                  <td>{average_price}</td>
                  <td>{last_price}</td>
                  <td>{parseFloat(pnl).toFixed(2)}</td>
                  <td>{`${netChangePercent}%`}</td>
                </tr>
              )
            })
          }
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Total</td>
            <td>{parseFloat(totalPNL).toFixed(2)}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  }
}
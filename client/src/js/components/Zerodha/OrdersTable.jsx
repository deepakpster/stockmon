// @flow
import React from 'react';
import styles from './styles.scss';

export default class OrdersTable extends React.Component {
  render() {
    console.log('store', this.props.store)
    const {store} = this.props;
    console.log('')
    return (
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>Instrument</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Avg.price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            store && store.map(stock=>{
              const {
                average_price,
                cancelled_quantity,
                disclosed_quantity,
                exchange,
                exchange_order_id,
                exchange_timestamp,
                exchange_update_timestamp,
                filled_quantity,
                guid,
                instrument_token,
                market_protection,
                order_id,
                order_timestamp,
                order_type,
                parent_order_id,
                pending_quantity,
                placed_by,
                price,
                product,
                quantity,
                status,
                status_message,
                tag,
                tradingsymbol,
                transaction_type,
                trigger_price,
                validity,
                variety
              } = stock;

              return (
                <tr key={`${tradingsymbol}-${order_timestamp}`}>
                  <td>{order_timestamp}</td>
                  <td>{transaction_type}</td>
                  <td>{tradingsymbol}</td>
                  <td>{product}</td>
                  <td>{`${pending_quantity}/${quantity}`}</td>
                  <td>{`${trigger_price ? `${trigger_price}/${trigger_price}trg` : average_price}`}</td>
                  <td>{status}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}
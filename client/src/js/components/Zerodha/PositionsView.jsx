// @flow
import React from 'react';
import styles from './styles.scss';
import PositionsTable from './PositionsTable';

export default class PositionsView extends React.Component {
  render() {
    console.log('store', this.props.store)
    const {store} = this.props;
    return (
      <div>
        <div>
          <span>Net Position</span>
          <PositionsTable store={store.net}/>
        </div>
        <div>
          <span>Day Position</span>
          <PositionsTable store={store.day}/>
        </div>
      </div>
    );
  }
}
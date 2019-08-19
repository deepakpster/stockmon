// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { dashboardActions } from './../../actions';
import styles from './styles.scss';


class Dashboard extends React.Component {
  componentWillMount(){
    this.props.actions.getAllContactsInfo();
  }
	
  render() {
    const {contactsInfo} = this.props.dashboardState;
		return <div className={styles.dashboard}>
      <div className={styles.title}>
        <span>Sales Management System</span>
      </div>
      <div>
        <div className={styles.toolbar}>
          <div class="dropdown">
            <span>Column: </span>
            <button class="btn dropdown-toggle" type="button" id="columnMenuBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown button
            </button>
            <div class="dropdown-menu" aria-labelledby="columnMenuBtn">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </div>
          <div class="dropdown">
            <span>Sort By: </span>
            <button class="btn dropdown-toggle" type="button" id="sortMenuBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown button
            </button>
            <div class="dropdown-menu" aria-labelledby="sortMenuBtn">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
            </div>
          </div>
          
        </div>
        <div className="table-responsive-sm">
          <table className="table table-sm table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">VID</th>
                <th scope="col">created date</th>
                <th scope="col">since created</th>
                <th scope="col">customer tag</th>
                <th scope="col">company id</th>
                <th scope="col">n1st email sent date</th>
                <th scope="col">since n1st email sent date</th>
                <th scope="col">hs email last open date</th>
                <th scope="col">since hs email last open date</th>
                <th scope="col">hs sales email last clicked</th>
                <th scope="col">since hs sales email last clicked</th>
              </tr>
            </thead>
            <tbody>
              {
                contactsInfo.map((contactItem, idx)=>{
                  const {vid, createdate, customer_tag, associatedcompanyid, hs_email_last_open_date, n1st_email_sent_date, hs_sales_email_last_clicked} = contactItem;
                  return (<tr key={contactItem.vid}>
                    <th scope="row">{vid}</th>
                    <td>{createdate && moment(parseInt(createdate)).format('D/MM/YYYY hh:mm:ss A')}</td>
                    <td>{createdate && moment().diff(parseInt(createdate), 'days')} days</td>
                    <td>{customer_tag && customer_tag}</td>
                    <td>{associatedcompanyid && associatedcompanyid}</td>
                    <td>{n1st_email_sent_date && moment(parseInt(n1st_email_sent_date)).format('D/MM/YYYY hh:mm:ss A')}</td>
                    <td>{n1st_email_sent_date && moment().diff(parseInt(n1st_email_sent_date), 'days')} days</td>
                    <td>{hs_email_last_open_date && moment(parseInt(hs_email_last_open_date)).format('D/MM/YYYY hh:mm:ss A')}</td>
                    <td>{hs_email_last_open_date && moment().diff(parseInt(hs_email_last_open_date), 'days')} days</td>
                    <td>{hs_sales_email_last_clicked && moment(parseInt(hs_sales_email_last_clicked)).format('D/MM/YYYY hh:mm:ss A')}</td>
                    <td>{hs_sales_email_last_clicked && moment().diff(parseInt(hs_sales_email_last_clicked), 'days')} days</td>
                  </tr>)
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
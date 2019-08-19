// @flow
import {fetchStockUpdate} from '../sockets';
import {fetchAllContactsInfo} from '../utils/api';

// export function updateUserChat(chat) {
// 	return (dispatch) => {
// 		emitUserChat(chat.text);
// 		dispatch({ type: 'UPDATE_USER_CHAT', chat });
// 	};
// }

export function getAllContactsInfo () {
  return (dispatch, getState) => {
    return fetchAllContactsInfo().then(contactsInfo =>{
		  console.log('getAllContactsInfo::action', contactsInfo);
      dispatch({type: 'FETCH_CONTACTS_INFO_SUCCESS', contactsInfo});
    }).catch(err=>{
      dispatch({type: 'FETCH_CONTACTS_INFO_FAILURE'});
      console.log('error::', err);
    })
  }  
}
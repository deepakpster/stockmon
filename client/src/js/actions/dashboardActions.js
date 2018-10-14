// @flow
import {fetchStockUpdate} from '../sockets';
import {getNifty50Gainers} from '../utils/api';

// export function updateUserChat(chat) {
// 	return (dispatch) => {
// 		emitUserChat(chat.text);
// 		dispatch({ type: 'UPDATE_USER_CHAT', chat });
// 	};
// }

export function fetchNifty50Gainers () {
  return (dispatch: Dispatch, getState: GetState) => {
    return getNifty50Gainers().then(nifty50GainersList =>{
			console.log('nifty50Gainers::action', nifty50GainersList);
      dispatch({type: 'FETCH_NIFTY_50_GAINERS_SUCCESS', data: nifty50GainersList});
    }).catch(err=>{
      dispatch({type: 'FETCH_NIFTY_50_GAINERS_FAILURE'});
      console.log('error::', err);
    })
  }  
}

export function fetchStockDetail(symbol) {
	return (dispatch) => {
		fetchStockUpdate(symbol);
		dispatch({ type: 'FETCH_STOCK_DETAIL', symbol });
	};
}

export function updateStock(stock) {
	return (dispatch) => {
		dispatch({ type: 'UPDATE_STOCK_DETAIL', stock });
	};
}

// export function clearChat() {
// 	return (dispatch) => {
// 		dispatch({ type: 'CLEAR_CHAT' });
// 	};
// }
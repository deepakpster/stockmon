import { updateStock } from '../actions/dashboardActions';
import io from 'socket.io-client';
const socket = io('localhost:5001');

const setupSocket = (dispatch) => {
  socket.on('stockDetailUpdated', (res)=>{
    dispatch(updateStock(res));
  });
  return socket;
}

export function fetchStockUpdate(symbol) {
  console.log('fetchStockUpdate:: ', symbol);
  socket.emit('fetchStockUpdate', { symbol });
}

export default setupSocket;

import { updateStock, updateMarketWatch, updateHoldings, updatePositions, updateOrders } from '../actions/dashboardActions';
import io from 'socket.io-client';
const socket = io('localhost:5001');

const setupSocket = (dispatch) => {
  socket.on('stockDetailUpdated', (res)=>{
    dispatch(updateStock(res));
  });
  socket.on('marketWatch', (res)=>{
    dispatch(updateMarketWatch(res));
  });
  socket.on('holdings', (res)=>{
    dispatch(updateHoldings(res));
  });
  socket.on('positions', (res)=>{
    dispatch(updatePositions(res));
  });
  socket.on('orders', (res)=>{
    dispatch(updateOrders(res));
  });
  return socket;
}

export function fetchStockUpdate(symbol) {
  socket.emit('fetchStockUpdate', { symbol });
}

export default setupSocket;

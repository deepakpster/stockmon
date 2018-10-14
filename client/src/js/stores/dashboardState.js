// @flow

const initialState = {
  stocks: {},
  nifty50Gainers: []
};

export default(state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_NIFTY_50_GAINERS_SUCCESS':
      console.log('nifty50Gainers::state', action.data);
      return {...state, nifty50Gainers: action.data}
    case 'UPDATE_STOCK_DETAIL':
      const { stock } = action;
      const { stocks } = state;
      const st_meta = stock['Meta Data'];
      const st_timeSeries = stock['Time Series (15min)'];
      stocks[st_meta["2. Symbol"]] = {
        meta: st_meta,
        data: st_timeSeries
      };
      return {...state, stocks}
    default:
      return state;
  }
}
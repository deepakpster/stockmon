// @flow

const initialState = {
  contactsInfo: []
};

export default(state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CONTACTS_INFO_SUCCESS':
      return {...state, contactsInfo: action.contactsInfo.contacts}
    default:
      return state;
  }
}
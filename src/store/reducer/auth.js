import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: null,
  error: null,
  success: null,
  userDetails:{},
  cardDetails:{}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_AUTH:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: null,
        error: action.message,
        success: null,
      }
      case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        loading: null,
        success: action.message,
        error: null,
      }
    default:
      return state;
  }
};

export default reducer;

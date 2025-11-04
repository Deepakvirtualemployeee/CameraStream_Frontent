import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: null,
  error: null,
  success: null,
  userDetails:{},
  cardDetails:{},
  
};

const reducer = (state = initialState, action) => {
    console.log("Action dispatched:", action.type); 
  switch (action.type) {
    case actionTypes.START_AUTH:
      return {
        ...state,
        loading: true,
        error: null
      };
    case actionTypes.AUTH_FAIL:
         console.log("AUTH_FAIL - clearing userDetails"); 
      return {
        ...state,
        loading: null,
        error: action.message,
        success: null,
        
      }
case actionTypes.AUTH_SUCCESS:
  console.log("AUTH_SUCCESS payload:", action.payload);
  return {
    ...state,
    loading: null,
    success: action.payload.message,
    userDetails: action.payload.user ,  
    error: null,
  }
    default:
      return state;
  }
};

export default reducer;

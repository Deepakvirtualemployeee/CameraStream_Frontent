import * as actionTypes from "../actions/actionTypes";

const initialState = {
    loading: false,
    portalUsers: [],   // all users
    portalUser: null,  // single user
    error: null,
  };
  
  const portalUsersReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionTypes.GET_PORTAL_USERS_REQUEST:
      case actionTypes.GET_PORTAL_USERS_BY_ID_REQUEST:
        return { ...state, loading: true };
  
      case actionTypes.GET_PORTAL_USERS_SUCCESS:
        return { ...state, loading: false, portalUsers: action.payload };
  
      case actionTypes.GET_PORTAL_USERS_FAILURE:
      case actionTypes.GET_PORTAL_USERS_BY_ID_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case actionTypes.GET_PORTAL_USERS_BY_ID_SUCCESS:
        return { ...state, loading: false, portalUser: action.payload };
  
      case actionTypes.CREATE_PORTAL_USERS_SUCCESS:
        return { ...state, portalUsers: [...state.portalUsers, action.payload] };
  
      case actionTypes.UPDATE_PORTAL_USERS_SUCCESS:
      case actionTypes.ACTIVATE_PORTAL_USERS_SUCCESS:
      case actionTypes.DEACTIVATE_PORTAL_USERS_SUCCESS:
        return {
          ...state,
          portalUsers: state.portalUsers.map((v) =>
            v._id === action.payload._id ? action.payload : v
          ),
          portalUser:
            state.portalUser && state.portalUser._id === action.payload._id
              ? action.payload
              : state.portalUser,
        };
  
      case actionTypes.DELETE_PORTAL_USERS_SUCCESS:
        return {
          ...state,
          portalUsers: state.portalUsers.filter((v) => v._id !== action.payload),
        };
  
      default:
        return state;
    }
  };
  
  export default portalUsersReducer;

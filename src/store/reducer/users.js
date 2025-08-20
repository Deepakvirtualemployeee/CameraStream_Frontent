import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  success: null,
  users: [],
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_USERS:
      return { ...state, loading: true, error: null, success: null };

    case actionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
        success: action.message,
        error: null,
      };

    case actionTypes.USERS_FAIL:
      return { ...state, loading: false, error: action.message };

    default:
      return state;
  }
};

export default usersReducer;

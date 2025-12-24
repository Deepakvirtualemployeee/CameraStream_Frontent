import * as actionTypes from "../actions/actionTypes";

const initialState = {
  events: [],
  meta: null,
  loading: false,
  error: null,
  assignLoading: false,
};

const unidentifiedEventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_UNIDENTIFIED_EVENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.GET_UNIDENTIFIED_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload?.append
          ? [...state.events, ...(action.payload?.data || [])]
          : action.payload?.data || [],
        meta: action.payload?.meta || null,
      };
    case actionTypes.GET_UNIDENTIFIED_EVENTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case actionTypes.ASSIGN_UNIDENTIFIED_EVENT_REQUEST:
      return { ...state, assignLoading: true, error: null };
    case actionTypes.ASSIGN_UNIDENTIFIED_EVENT_SUCCESS:
      return { ...state, assignLoading: false };
    case actionTypes.ASSIGN_UNIDENTIFIED_EVENT_FAIL:
      return { ...state, assignLoading: false, error: action.payload };
    default:
      return state;
  }
};

export default unidentifiedEventsReducer;

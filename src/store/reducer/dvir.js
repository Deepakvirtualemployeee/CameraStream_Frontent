import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  created: null,
  list: [],
  unitDefects: [],
  trailerDefects: [],
  current: null,
  error: null,
};

const dvirReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_DVIR_REQUEST:
    case actionTypes.GET_DVIRS_REQUEST:
    case actionTypes.GET_UNIT_DEFECTS_REQUEST:
    case actionTypes.GET_TRAILER_DEFECTS_REQUEST:
    case actionTypes.GET_DVIR_BY_ID_REQUEST:
    case actionTypes.UPDATE_DVIR_REQUEST:
      return { ...state, loading: true, error: null };
    case actionTypes.CREATE_DVIR_SUCCESS:
      return { ...state, loading: false, created: action.payload, error: null };
    case actionTypes.GET_DVIRS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case actionTypes.GET_UNIT_DEFECTS_SUCCESS:
      return { ...state, loading: false, unitDefects: action.payload, error: null };
    case actionTypes.GET_TRAILER_DEFECTS_SUCCESS:
      return { ...state, loading: false, trailerDefects: action.payload, error: null };
    case actionTypes.GET_DVIR_BY_ID_SUCCESS:
      return { ...state, loading: false, current: action.payload, error: null };
    case actionTypes.UPDATE_DVIR_SUCCESS:
      return { ...state, loading: false, current: action.payload, error: null };
    case actionTypes.CREATE_DVIR_FAIL:
    case actionTypes.GET_DVIRS_FAIL:
    case actionTypes.GET_UNIT_DEFECTS_FAIL:
    case actionTypes.GET_TRAILER_DEFECTS_FAIL:
    case actionTypes.GET_DVIR_BY_ID_FAIL:
    case actionTypes.UPDATE_DVIR_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default dvirReducer;

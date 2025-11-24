import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  recordId: null,
  reportData: null,
  error: null,
};

const iftaReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_IFTA_REPORT_REQUEST:
    case actionTypes.GET_IFTA_REPORT_DETAILS_REQUEST:
      return { ...state, loading: true };

    case actionTypes.CREATE_IFTA_REPORT_SUCCESS:
      return { ...state, loading: false, recordId: action.payload.data };

    case actionTypes.GET_IFTA_REPORT_DETAILS_SUCCESS:
      return { ...state, loading: false, reportData: action.payload.data };

    case actionTypes.CREATE_IFTA_REPORT_FAIL:
    case actionTypes.GET_IFTA_REPORT_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };

    case actionTypes.DOWNLOAD_IFTA_REPORT_REQUEST:
      return { ...state, loading: true };

    case actionTypes.DOWNLOAD_IFTA_REPORT_SUCCESS:
      return { ...state, loading: false };

    case actionTypes.DOWNLOAD_IFTA_REPORT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default iftaReducer;

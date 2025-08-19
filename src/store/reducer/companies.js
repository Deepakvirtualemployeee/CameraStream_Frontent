import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  success: null,
  companies: [],
};

const companiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_COMPANIES:
      return {
        ...state,
        loading: true,
        error: null,
        success: null,
      };

    case actionTypes.COMPANIES_SUCCESS:
      return {
        ...state,
        loading: false,
        companies: action.payload,           // array of companies
        success: action.message || null,
        error: null,
      };

    case actionTypes.DELETE_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        companies: state.companies.filter(c =>
          c._id !== action.payload &&
          c.id !== action.payload &&
          c.companyId !== action.payload &&
          c.timeZoneId !== action.payload
        ),
        success: action.message || null,
        error: null,
      };

    case actionTypes.COMPANIES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.message,
        success: null,
      };

    default:
      return state;
  }
};

export default companiesReducer;

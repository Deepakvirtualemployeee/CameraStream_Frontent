import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  success: null,
  companies: [],
  company: null,
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

      // Get company info by id
      case actionTypes.START_COMPANY_INFO:
      return { ...state, loading: true, error: null };
    case actionTypes.COMPANY_INFO_SUCCESS:
      return { ...state, loading: false, company: action.payload };
    case actionTypes.COMPANY_INFO_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default companiesReducer;

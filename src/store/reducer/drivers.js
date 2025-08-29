// reducer/drivers.js
import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  drivers: [],     // all drivers
  coDrivers: [],   // co-drivers for selected driver
  issuingState: [],   // co-drivers for selected driver

};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_DRIVER_REQUEST:
      return { ...state, loading: true, error: null };

    case actionTypes.ADD_DRIVER_SUCCESS:
      return {
        ...state,
        loading: false,
        drivers: [...state.drivers, action.payload],
      };

    case actionTypes.ADD_DRIVER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Fetch drivers
    case actionTypes.FETCH_DRIVERS_REQUEST:
      return { ...state, loading: true, drivers: [] };

    case actionTypes.FETCH_DRIVERS_SUCCESS:
      return { ...state, loading: false, drivers: action.payload };

    case actionTypes.FETCH_DRIVERS_FAILURE:
      return { ...state, loading: false, error: action.payload, drivers: [] };

    // Single driver
    case "GET_DRIVER_REQUEST":
    case "UPDATE_DRIVER_REQUEST":
      return { ...state, loading: true };

    // case "GET_DRIVER_SUCCESS":
    //   return { ...state, loading: false, driver: action.payload };

    case "GET_DRIVER_SUCCESS":
      return { ...state, loading: false, driver: Array.isArray(action.payload) ? action.payload[0] : action.payload };


    case "UPDATE_DRIVER_SUCCESS":
      return { ...state, loading: false, driver: action.payload };

    case "GET_DRIVER_FAILURE":
    case "UPDATE_DRIVER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    // co-drivers
    case actionTypes.GET_CO_DRIVERS:
      return { ...state, loading: false, coDrivers: action.payload };

    // Issuing state
    case actionTypes.GET_DRIVERS_STATE:
      return { ...state, loading: false, issuingState: action.payload };

    case actionTypes.DELETE_DRIVER_SUCCESS:
      return {
        ...state,
        drivers: state.drivers.filter((v) => v._id !== action.payload),
      };

    default:
      return state;
  }
};

export default driverReducer;

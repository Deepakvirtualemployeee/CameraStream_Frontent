import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  drivers: [], // list of drivers
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
        return { loading: true, drivers: [] };
      case actionTypes.FETCH_DRIVERS_SUCCESS:
        return { loading: false, drivers: action.payload };
      case actionTypes.FETCH_DRIVERS_FAILURE:
        return { loading: false, error: action.payload, drivers: [] };

        // Update drivers
        case "GET_DRIVER_REQUEST":
    case "UPDATE_DRIVER_REQUEST":
      return { ...state, loading: true };

    case "GET_DRIVER_SUCCESS":
      return { ...state, loading: false, driver: action.payload };

    case "UPDATE_DRIVER_SUCCESS":
      return { ...state, loading: false, driver: action.payload };

    case "GET_DRIVER_FAILURE":
    case "UPDATE_DRIVER_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default driverReducer;

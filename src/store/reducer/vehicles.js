import * as actionTypes from "../actions/actionTypes";

const initialState = {
  vehicles: [],
  loading: false,
  error: null,
};

const vehiclesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_VEHICLES_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case actionTypes.GET_VEHICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        vehicles: action.payload,   // assign array
      };

    case actionTypes.GET_VEHICLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.CREATE_VEHICLE_SUCCESS:
      return {
        ...state,
        vehicles: [...state.vehicles, action.payload],  // add new vehicle
      };

    case actionTypes.UPDATE_VEHICLE_SUCCESS:
      return {
        ...state,
        vehicles: state.vehicles.map((v) =>
          v._id === action.payload._id ? action.payload : v
        ),
      };

    case actionTypes.DELETE_VEHICLE_SUCCESS:
      return {
        ...state,
        vehicles: state.vehicles.filter((v) => v._id !== action.payload),
      };

      case actionTypes.GET_VEHICLE_BY_ID_REQUEST:
        return { ...state, loading: true };
      
      case actionTypes.GET_VEHICLE_BY_ID_SUCCESS:
        return { ...state, loading: false, vehicle: action.payload };
      
      case actionTypes.GET_VEHICLE_BY_ID_FAILURE:
        return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default vehiclesReducer;

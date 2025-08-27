import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loadings: false,
  error: null,
  eldDevices: [],
  eldDevice: null,
  unassignedElds: [],
};

const eldDeviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ELD_DEVICES_REQUEST:
    case actionTypes.ADD_ELD_DEVICE_REQUEST:
    case "GET_ELD_DEVICE_REQUEST":
    case "UPDATE_ELD_DEVICE_REQUEST":
      return { ...state, loadings: true, error: null };

    case actionTypes.FETCH_ELD_DEVICES_SUCCESS:
      return { ...state, loadings: false, eldDevices: action.payload };

    case actionTypes.ADD_ELD_DEVICE_SUCCESS:
      return {
        ...state,
        loadings: false,
        eldDevices: [...state.eldDevices, action.payload],
      };

    case "GET_ELD_DEVICE_SUCCESS":
      return { ...state, loadings: false, eldDevice: action.payload };

    case "UPDATE_ELD_DEVICE_SUCCESS":
      return { ...state, loadings: false, eldDevice: action.payload };

    case actionTypes.FETCH_ELD_DEVICES_FAILURE:
    case actionTypes.ADD_ELD_DEVICE_FAILURE:
    case "GET_ELD_DEVICE_FAILURE":
    case "UPDATE_ELD_DEVICE_FAILURE":
      return { ...state, loadings: false, error: action.payload };

    // handle unassigned ELDs
    case actionTypes.GET_UNASSIGNED_ELDS:
      return { ...state, loadings: false, unassignedElds: action.payload };

    default:
      return state;
  }
};

export default eldDeviceReducer;

import * as actionTypes from "../actions/actionTypes";

const initialState = {
  loadings: false,
  error: null,
  cameraDevices: [],
  cameraDevice: null,
  unassignedCameraDevices: [],
};

const cameraDeviceReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ELD_DEVICES_REQUEST:
    case actionTypes.ADD_ELD_DEVICE_REQUEST:
    case actionTypes.GET_ELD_DEVICE_REQUEST:
    case actionTypes.UPDATE_ELD_DEVICE_REQUEST:
      return { ...state, loadings: true, error: null };

    case actionTypes.FETCH_ELD_DEVICES_SUCCESS:
      return { ...state, loadings: false, cameraDevices: action.payload };

    case actionTypes.ADD_ELD_DEVICE_SUCCESS:
      return {
        ...state,
        loadings: false,
        cameraDevices: [...state.cameraDevices, action.payload],
      };

    case actionTypes.GET_ELD_DEVICE_SUCCESS:
      return { ...state, loadings: false, cameraDevice: action.payload };

    case actionTypes.UPDATE_ELD_DEVICE_SUCCESS:
      return { ...state, loadings: false, cameraDevice: action.payload };

    case actionTypes.FETCH_ELD_DEVICES_FAILURE:
    case actionTypes.ADD_ELD_DEVICE_FAILURE:
    case actionTypes.GET_ELD_DEVICE_FAILURE:
    case actionTypes.UPDATE_ELD_DEVICE_FAILURE:
      return { ...state, loadings: false, error: action.payload };

    // handle unassigned camera devices
    case actionTypes.GET_UNASSIGNED_ELDS:
      return { ...state, loadings: false, unassignedCameraDevices: action.payload };

    default:
      return state;
  }
};

export default cameraDeviceReducer;

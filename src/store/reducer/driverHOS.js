import * as actionTypes from "../actions/actionTypes";

const initialState = {
    driversHOS: [],
    driverLogs: [],
    driverData: [],
    driverSettings: [],
    loading: false,
    error: null,
};

const driversHOSReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_DRIVERS_HOS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_DRIVERS_HOS_SUCCESS:
            return { ...state, loading: false, driversHOS: action.payload };
        case actionTypes.GET_DRIVERS_HOS_FAIL:
            return { ...state, loading: false, error: action.payload };

        case actionTypes.GET_DRIVERS_LOGS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_DRIVERS_LOGS_SUCCESS:
            return { ...state, loading: false, driverLogs: action.payload };
        case actionTypes.GET_DRIVERS_LOGS_FAIL:
            return { ...state, loading: false, error: action.payload };

        case actionTypes.GET_DRIVERS_DATA_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_DRIVERS_DATA_SUCCESS:
            return { ...state, loading: false, driverData: action.payload };
        case actionTypes.GET_DRIVERS_DATA_FAIL:
            return { ...state, loading: false, error: action.payload };

        case actionTypes.GET_DRIVERS_SETTINGS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_DRIVERS_SETTINGS_SUCCESS:
            return { ...state, loading: false, driverSettings: action.payload };
        case actionTypes.GET_DRIVERS_SETTINGS_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default driversHOSReducer;
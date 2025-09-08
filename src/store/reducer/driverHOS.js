import * as actionTypes from "../actions/actionTypes";

const initialState = {
    driversHOS: [],
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
        default:
            return state;
    }
};

export default driversHOSReducer;
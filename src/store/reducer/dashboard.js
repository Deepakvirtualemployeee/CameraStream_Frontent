import * as actionTypes from "../actions/actionTypes";

const initialState = {
    vehicles: [],
    loading: false,
    error: null,
};

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_DASHBOARD_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.GET_DASHBOARD_SUCCESS:
            return { ...state, loading: false, vehicles: action.payload };
        case actionTypes.GET_DASHBOARD_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default dashboardReducer;
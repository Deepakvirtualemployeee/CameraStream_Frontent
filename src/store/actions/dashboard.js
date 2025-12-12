import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
// import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getDashboardVehicles = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DASHBOARD_REQUEST });

    const { data } = await axios.get(`/dashoard/vehicleStatus?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("dashoard/vehicleStatus:", data);
    dispatch({ type: actionTypes.GET_DASHBOARD_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DASHBOARD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const getDashboardVehicleList = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DASHBOARD_REQUEST });

    const { data } = await axios.get(
      `/dashboard/driverStatus?companyId=${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch({ type: actionTypes.GET_DASHBOARD_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DASHBOARD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};



export const getVehiclePathAction = (vehicleId, date, companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_VEHICLE_PATH_REQUEST });

    const { data } = await axios.get(
      `/dashboard/getVehiclePath?vehicleId=${vehicleId}&date=${date}&companyId=${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    dispatch({
      type: actionTypes.GET_VEHICLE_PATH_SUCCESS,
      payload: data.data.locations,
    });

  } catch (error) {
    dispatch({
      type: actionTypes.GET_VEHICLE_PATH_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};




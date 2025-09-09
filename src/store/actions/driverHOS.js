import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

export const getDriversHOS = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_HOS_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/drivehos/list?companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Company:", companyId);
    console.log("HOS list:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_HOS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_HOS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getDriverLogs = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_LOGS_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/driverLogs?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Driver logs:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_LOGS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_LOGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getDriverData = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_DATA_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/fetchHome?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Fetch home:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_DATA_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_DATA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

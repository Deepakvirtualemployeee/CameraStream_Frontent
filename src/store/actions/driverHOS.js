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

export const getDriverLogs = (driverId, logDate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_LOGS_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/driverLogs?driverId=${driverId}&logDate=${logDate}`, {
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

export const getMobileSettings = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_SETTINGS_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/mobileSetting?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("Mobile settings:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_SETTINGS_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_SETTINGS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getProcessedDriverData = (driverId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_DRIVERS_PROCESSED_DATA_REQUEST });

    const token = localStorage.getItem("token");
    const { data } = await axios.get(`/processDriverData?driverId=${driverId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Company:", companyId);
    console.log("ProcessedDriverData:", data);
    dispatch({ type: actionTypes.GET_DRIVERS_PROCESSED_DATA_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: actionTypes.GET_DRIVERS_PROCESSED_DATA_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add Event Action
export const addEvent = (companyId, driverId, eventId = "", eventData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVERS_EVENT_LOG_REQUEST });

    const res = await axios.post(
      `/addEditEvent?companyId=${companyId}&DriverId=${driverId}&eventId=${eventId}`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Event data", eventData);
    dispatch({
      type: actionTypes.ADD_DRIVERS_EVENT_LOG_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Event added successfully!");
    if (navigate) navigate(`/driver-hos/graph-details/${companyId}/${driverId}`); // redirect after success
    
    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.ADD_DRIVERS_EVENT_LOG_FAIL,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to add event");
    return false;
  }
};
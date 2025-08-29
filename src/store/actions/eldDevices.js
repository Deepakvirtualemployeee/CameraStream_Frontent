import axios from "../../axios-config";
import { toast } from "react-toastify";
import * as actionTypes from "../actions/actionTypes";

const token = localStorage.getItem("token");

// Fetch ELD Devices by companyId
export const fetchEldDevices = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.FETCH_ELD_DEVICES_REQUEST });

    const { data } = await axios.get(`/elds?companyId=${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    dispatch({
      type: actionTypes.FETCH_ELD_DEVICES_SUCCESS,
      payload: data.data,
    });
  } catch (err) {
    dispatch({
      type: actionTypes.FETCH_ELD_DEVICES_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Add ELD Device
export const addEldDevice = (companyId, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_ELD_DEVICE_REQUEST });

    const res = await axios.post(
      `/eld-devices?companyId=${companyId}`,
      deviceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: actionTypes.ADD_ELD_DEVICE_SUCCESS,
      payload: res.data.data,
    });

    toast.success("ELD Device added successfully!");
    if (navigate) navigate("/settings/eld-devices");
    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.ADD_ELD_DEVICE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to add ELD Device");
    return false;
  }
};

// Get ELD Device by ID
export const getEldDeviceById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "GET_ELD_DEVICE_REQUEST" });

    const res = await axios.get(`/eld-devices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: "GET_ELD_DEVICE_SUCCESS",
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: "GET_ELD_DEVICE_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Update ELD Device
export const updateEldDevice = (id, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_ELD_DEVICE_REQUEST" });

    const res = await axios.put(`/eld-devices/${id}`, deviceData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch({
      type: "UPDATE_ELD_DEVICE_SUCCESS",
      payload: res.data.data,
    });

    toast.success("ELD Device updated successfully!");
    if (navigate) navigate("/settings/eld-devices");
  } catch (err) {
    dispatch({
      type: "UPDATE_ELD_DEVICE_FAILURE",
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to update ELD Device");
  }
};

// Get all unassigned ELDs
export const getUnassignedElds = (companyId) => async (dispatch) => {
    try {
      const res = await axios.get(`/elds/unassigned?companyId=${companyId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
          }
      );
      console.log("Unassigned elds:", res);
      dispatch({ type: actionTypes.GET_UNASSIGNED_ELDS, payload: res.data.data });
    } catch (error) {
      console.error("Error fetching unassigned ELDs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch unassigned ELDs");
    }
  };

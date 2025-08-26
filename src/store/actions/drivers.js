import axios from "../../axios-config";
import { toast } from "react-toastify";
import * as actionTypes from "../actions/actionTypes";


const token = localStorage.getItem("token"); // or however you store JWT

// Add Driver Action
export const addDriver = (companyId, driverData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ADD_DRIVER_REQUEST });

    const res = await axios.post(
      `/drivers?companyId=${companyId}`, // API endpoint for adding driver
      driverData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Driver data", driverData);
    dispatch({
      type: actionTypes.ADD_DRIVER_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Driver added successfully!");
    if (navigate) navigate("/settings/drivers-list"); // redirect after success
    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.ADD_DRIVER_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to add driver");
    return false;
  }
};

// Fetch Drivers by companyId
export const fetchDrivers = (companyId) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.FETCH_DRIVERS_REQUEST });
  
      const { data } = await axios.get(`/drivers?companyId=${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    //  const { data } = await axios.get(`/drivers`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    console.log(data);
      dispatch({
        type: actionTypes.FETCH_DRIVERS_SUCCESS,
        payload: data.data,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.FETCH_DRIVERS_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
    }
  };

  // Get driver by ID
export const getDriverById = (id) => async (dispatch) => {
    try {
      dispatch({ type: "GET_DRIVER_REQUEST" });
      const res = await axios.get(`/drivers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "GET_DRIVER_SUCCESS", payload: res.data.data });
    } catch (err) {
      dispatch({
        type: "GET_DRIVER_FAILURE",
        payload: err.response?.data?.message || err.message,
      });
    }
  };
  
  // Update driver
  export const updateDriver = (id, driverData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: "UPDATE_DRIVER_REQUEST" });
      const res = await axios.put(`/drivers/${id}`, driverData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({ type: "UPDATE_DRIVER_SUCCESS", payload: res.data.data });
      toast.success("Driver updated successfully!");
      if (navigate) navigate("/settings/drivers-listing");
    } catch (err) {
      dispatch({
        type: "UPDATE_DRIVER_FAILURE",
        payload: err.response?.data?.message || err.message,
      });
      toast.error("Failed to update driver");
    }
  };
  
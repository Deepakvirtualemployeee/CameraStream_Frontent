import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

// Get all vehicles
export const getVehicles = () => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_VEHICLES_REQUEST });
    const res = await axios.get("/vehicles", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("res:", res.data.data);
    // vehicles list is in res.data.data (array)
    dispatch({
      type: actionTypes.GET_VEHICLES_SUCCESS,
      payload: res.data.data || [],
    });
  } catch (err) {
    dispatch({
      type: actionTypes.GET_VEHICLES_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
  }
};

// Create vehicle
export const createVehicle = (vehicleData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.CREATE_VEHICLE_REQUEST });
  
      const res = await axios.post("/vehicles/add", vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      dispatch({
        type: actionTypes.CREATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle created successfully!");
  
      // refresh list
      dispatch(getVehicles());
  
      // redirect to list page
      if (navigate) navigate("/settings/vehicles-list");
    } catch (err) {
      dispatch({
        type: actionTypes.CREATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to create vehicle");
    }
  };
  
// Update vehicle
export const updateVehicle = (id, vehicleData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.UPDATE_VEHICLE_REQUEST });
    const res = await axios.put(`/vehicles/${id}`, vehicleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: actionTypes.UPDATE_VEHICLE_SUCCESS,
      payload: res.data.data,
    });
    toast.success("Vehicle updated successfully!");

    if (navigate) navigate("/settings/vehicles-list");

  } catch (err) {
    dispatch({
      type: actionTypes.UPDATE_VEHICLE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to update vehicle");
  }
};

// Get vehicle by ID
export const getVehicleById = (id) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.GET_VEHICLE_BY_ID_REQUEST });
  
      const res = await axios.get(`/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      dispatch({
        type: actionTypes.GET_VEHICLE_BY_ID_SUCCESS,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: actionTypes.GET_VEHICLE_BY_ID_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error("Failed to fetch vehicle details");
    }
  };
  
// Deactivate Vehicle
export const deactivateVehicle = (id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_REQUEST });
  
      const res = await axios.put(`/vehicles/${id}/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      dispatch({
        type: actionTypes.DEACTIVATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle deactivated successfully!");
      if (navigate) navigate("/settings/vehicles-list");

      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.DEACTIVATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error("Failed to deactivate vehicle");
      return false;
    }
  };
  
  // Activate Vehicle
export const activateVehicle = (id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.ACTIVATE_VEHICLE_REQUEST });
  
      const res = await axios.put(
        `/vehicles/${id}/activate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      dispatch({
        type: actionTypes.ACTIVATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle activated successfully!");
      if (navigate) navigate("/settings/vehicles-list");
    } catch (err) {
      dispatch({
        type: actionTypes.ACTIVATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error("Failed to activate vehicle");
    }
  };
  
  // Unassign ELD from Vehicle
  export const unassignEld = (id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.UNASSIGN_ELD_REQUEST });
  
      const res = await axios.put(`/vehicles/${id}/unassign-eld`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      dispatch({
        type: actionTypes.UNASSIGN_ELD_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("ELD unassigned successfully!");
      if (navigate) navigate("/settings/vehicles-list");
      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.UNASSIGN_ELD_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error("Failed to unassign ELD");
      return false;
    }
  };
  
// Delete vehicle
export const deleteVehicle = (id) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_VEHICLE_REQUEST });
    await axios.delete(`/vehicles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_VEHICLE_SUCCESS, payload: id });
    toast.success("Vehicle deleted successfully!");
  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_VEHICLE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to delete vehicle");
  }
};
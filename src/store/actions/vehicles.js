import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

// Get all vehicles
export const getVehicles = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_VEHICLES_REQUEST });
    const res = await axios.get(`/vehicles?companyId=${companyId}`, {
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
export const createVehicle = (companyId, vehicleData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.CREATE_VEHICLE_REQUEST });
  
      const res = await axios.post("/vehicles/add", vehicleData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Vehicle Data Create", vehicleData);
      dispatch({
        type: actionTypes.CREATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle created successfully!");
  
      // refresh list
      // dispatch(getVehicles(companyId));
  
      // redirect to list page
      if (navigate) navigate(`/settings/vehicles-list/${companyId}`);
    } catch (err) {
      console.log(err);
      dispatch({
        type: actionTypes.CREATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to create vehicle");
    }
  };
  
// Update vehicle
export const updateVehicle = (companyId, id, vehicleData, navigate) => async (dispatch) => {
  console.log("Veh data", vehicleData);
  try {
    dispatch({ type: actionTypes.UPDATE_VEHICLE_REQUEST });
    const res = await axios.put(`/vehicles?vehicleId=${id}`, vehicleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Update Veh:", res);
    dispatch({
      type: actionTypes.UPDATE_VEHICLE_SUCCESS,
      payload: res.data.data,
    });
    toast.success("Vehicle updated successfully!");

    if (navigate) navigate(`/settings/vehicles-list/${companyId}`);

  } catch (err) {
    console.log("Update Veh:", err);

    dispatch({
      type: actionTypes.UPDATE_VEHICLE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to update vehicle");
  }
};

// Get vehicle by ID
export const getVehicleById = (companyId, id) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.GET_VEHICLE_BY_ID_REQUEST });
  
      const res = await axios.get(`/vehicles?companyId=${companyId}&vehicleId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Vehicles:", res.data.data);
      dispatch({
        type: actionTypes.GET_VEHICLE_BY_ID_SUCCESS,
        payload: res.data.data[0],
      });
    } catch (err) {
      dispatch({
        type: actionTypes.GET_VEHICLE_BY_ID_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to fetch vehicle details");
    }
  };
  
// Deactivate Vehicle
export const deactivateVehicle = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.DEACTIVATE_VEHICLE_REQUEST });
  
      const res = await axios.put(`/vehicles/deactivate?companyId=${companyId}&vehicleId=${id}`, {}, {
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
      if (navigate) navigate(`/settings/vehicles-list/${companyId}`);

      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.DEACTIVATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to deactivate vehicle");
      return false;
    }
  };
  
  // Activate Vehicle
export const activateVehicle = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.ACTIVATE_VEHICLE_REQUEST });
  
      const res = await axios.put(
        `/vehicles/activate?companyId=${companyId}&vehicleId=${id}`,
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
      if (navigate) navigate(`/settings/vehicles-list/${companyId}`);
    } catch (err) {
      dispatch({
        type: actionTypes.ACTIVATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to activate vehicle");
    }
  };
  
  // Unassign ELD from Vehicle
  export const unassignEld = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.UNASSIGN_ELD_REQUEST });
  
      const res = await axios.put(`/vehicles/unassign-eld?companyId=${companyId}&vehicleId=${id}`, {}, {
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
      if (navigate) navigate(`/settings/vehicles-list/${companyId}`);
      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.UNASSIGN_ELD_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to unassign ELD");
      return false;
    }
  };
  
// Delete vehicle
export const deleteVehicle = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_VEHICLE_REQUEST });
    await axios.delete(`/vehicles?companyId=${companyId}&vehicleId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_VEHICLE_SUCCESS, payload: id });
    toast.success("Vehicle deleted successfully!");
    if (navigate) navigate(`/settings/vehicles-list/${companyId}`);

  } catch (err) {
    dispatch({
      type: actionTypes.DELETE_VEHICLE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to delete vehicle");
  }
};

// Get assignable vehicles for a driver
export const getAssignableVehicles = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.START_ASSIGNABLE_VEHICLES });

    const res = await axios.get(
      `/vehicles/available?companyId=${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Available veh:", res);
    dispatch({
      type: actionTypes.ASSIGNABLE_VEHICLES_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    dispatch({
      type: actionTypes.ASSIGNABLE_VEHICLES_FAIL,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to fetch vehicles");
  }
};
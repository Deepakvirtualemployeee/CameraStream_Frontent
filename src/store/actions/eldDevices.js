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
    console.log("Eld lists:", data);
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
      `/elds/add?companyId=${companyId}`,
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
    // if (navigate) navigate("/settings/eld-devices");
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);

    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.ADD_ELD_DEVICE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error("Failed to add ELD Device");
    return false;
  }
};

// Get ELD Device by ID
export const getEldDeviceById = (companyId, id) => async (dispatch) => {
  try {
    dispatch({ type: "GET_ELD_DEVICE_REQUEST" });

    const res = await axios.get(`/elds/detail?companyId=${companyId}&eldId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Edit ELD:", res);
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
export const updateEldDevice = (companyId, id, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_ELD_DEVICE_REQUEST" });

    const res = await axios.put(`/elds/update?eldId=${id}`, deviceData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Update ELD:", deviceData);
    dispatch({
      type: "UPDATE_ELD_DEVICE_SUCCESS",
      payload: res.data.data,
    });

    toast.success("ELD Device updated successfully!");
    // if (navigate) navigate("/settings/eld-devices");
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);

  } catch (err) {
    console.log(err);
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

// DELETE ELD device
export const deleteEld = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_ELD_REQUEST });

    const res = await axios.delete(`/elds/delete?eldId=${id}&companyId=${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: actionTypes.DELETE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Eld delete successfully!");
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);

    return true;
  } catch (err) {
    console.log(err);
    dispatch({
      type: actionTypes.DELETE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to delete eld");
    return false;
  }
};

// Deactivate ELD
export const deactivateEld = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DEACTIVATE_ELD_REQUEST });

    const res = await axios.put(`/elds/deactivate?companyId=${companyId}&eldId=${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: actionTypes.DEACTIVATE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Eld deactivated successfully!");
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);

    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.DEACTIVATE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to deactivate eld");
    return false;
  }
};

// Activate ELD
export const activateEld = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.ACTIVATE_ELD_REQUEST });

    const res = await axios.put(`/elds/activate?companyId=${companyId}&eldId=${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: actionTypes.ACTIVATE_ELD_SUCCESS,
      payload: res.data.data,
    });

    toast.success("Eld activated successfully!");
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);

    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.ACTIVATE_ELD_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to activate eld");
    return false;
  }
};

 // Unassign vehicle from eld
 export const unassignVehicleFromEld = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.UNASSIGN_ELD_REQUEST });

    const res = await axios.put(`/elds/unassign-vehicle?companyId=${companyId}&eldId=${id}`, {}, {
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
    if (navigate) navigate(`/settings/eld-devices/${companyId}`);
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
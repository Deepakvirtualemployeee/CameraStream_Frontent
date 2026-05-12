import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const buildVehiclePayload = (vehicleData = {}) => {
  const payload = {
    companyId: vehicleData.companyId,
    vehicleNumber: vehicleData.vehicleNumber?.trim(),
    make: vehicleData.make,
    model: vehicleData.model,
    fuelType: vehicleData.fuelType,
    licensePlateState: vehicleData.licensePlateState,
    licensePlateNumber: vehicleData.licensePlateNumber?.trim(),
  };

  if (vehicleData.year !== "" && vehicleData.year !== undefined && vehicleData.year !== null) {
    payload.year = Number(vehicleData.year);
  }

  if (vehicleData.vin) {
    payload.vin = vehicleData.vin.trim().toUpperCase();
  }

  if (vehicleData.eldSerialNumber) {
    payload.eldSerialNumber = vehicleData.eldSerialNumber;
  }

  if (vehicleData.eldId) {
    payload.eldId = vehicleData.eldId;
  }

  if (vehicleData.status) {
    payload.status = vehicleData.status;
  }

  return payload;
};

const buildDevicePayload = (deviceData = {}) => ({
  companyId: deviceData.companyId,
  deviceId: deviceData.deviceId?.trim() || "",
  deviceName: deviceData.deviceName?.trim() || "",
  deviceType: deviceData.deviceType || "",
  audioVideoChannelQty: Number(deviceData.audioVideoChannelQty || 0),
  channels: (deviceData.channels || []).map((channel, index) => ({
    key: channel.key || `CH${index + 1}`,
    name: channel.name?.trim() || "",
    enabled: Boolean(channel.enabled),
  })),
  fleetId: deviceData.fleetId?.trim() || "",
  nodeGuid: deviceData.nodeGuid?.trim() || "",
  nodeName: deviceData.nodeName?.trim() || "",
  intercomQty: Number(deviceData.intercomQty || 0),
  inputQty: Number(deviceData.inputQty || 0),
  outputQty: Number(deviceData.outputQty || 0),
  ioQty: Number(deviceData.ioQty || 0),
  ioName: deviceData.ioName?.trim() || "",
  hubIoQuantity: Number(deviceData.hubIoQuantity || 0),
  alarmAudioPrefix: deviceData.alarmAudioPrefix?.trim() || "",
  simNo: deviceData.simNo?.trim() || "",
  imsi: deviceData.imsi?.trim() || "",
  contactNo: deviceData.contactNo?.trim() || "",
  engineNo: deviceData.engineNo?.trim() || "",
  vinNumber: deviceData.vinNumber?.trim().toUpperCase() || "",
  plateNo: deviceData.plateNo?.trim() || "",
  drivingLicenseId: deviceData.drivingLicenseId?.trim() || "",
  vehicleType: deviceData.vehicleType?.trim() || "",
  remarks: deviceData.remarks?.trim() || "",
  vehicleNumber: deviceData.vehicleNumber?.trim() || "",
  make: deviceData.make || "",
  model: deviceData.model || "",
  year: deviceData.year?.toString().trim() || "",
  fuelType: deviceData.fuelType || "",
  licensePlateState: deviceData.licensePlateState || "",
  licensePlateNumber: deviceData.licensePlateNumber?.trim() || "",
});

// Get all vehicles
export const getVehicles = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.GET_VEHICLES_REQUEST });
    const res = await axios.get(`/vehicles?companyId=${companyId}`, {
      headers: getAuthHeaders(),
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

      const payload = buildVehiclePayload({
        ...vehicleData,
        companyId,
      });

      const res = await axios.post("/vehicles", payload, {
        headers: getAuthHeaders(),
      });
      console.log("Vehicle Data Create", payload);
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

    const payload = buildVehiclePayload({
      ...vehicleData,
      companyId,
    });

    const res = await axios.put(`/vehicles?vehicleId=${id}`, payload, {
      headers: getAuthHeaders(),
    });
    console.log("Update Veh:", res);
    dispatch({
      type: actionTypes.UPDATE_VEHICLE_SUCCESS,
      payload: res.data.data,
    });
    toast.success("Vehicle updated successfully!");

    if (navigate) navigate(`/settings/devices/${companyId}`);

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
        headers: getAuthHeaders(),
      });
      console.log("Vehicles:", res.data.data);
      dispatch({
        type: actionTypes.GET_VEHICLE_BY_ID_SUCCESS,
        payload: Array.isArray(res.data.data) ? res.data.data[0] : res.data.data,
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
  
      const res = await axios.patch(`/vehicles/deactivate?companyId=${companyId}&vehicleId=${id}`, {}, {
        headers: getAuthHeaders(),
      });
  
      dispatch({
        type: actionTypes.DEACTIVATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle deactivated successfully!");
      if (navigate) navigate(`/settings/devices/${companyId}`);

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
  
      const res = await axios.patch(
        `/vehicles/activate?companyId=${companyId}&vehicleId=${id}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );
  
      dispatch({
        type: actionTypes.ACTIVATE_VEHICLE_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Vehicle activated successfully!");
      if (navigate) navigate(`/settings/devices/${companyId}`);
      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.ACTIVATE_VEHICLE_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to activate vehicle");
      return false;
    }
  };

export const createDevice = (companyId, deviceData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.CREATE_VEHICLE_REQUEST });

    const payload = buildDevicePayload({
      ...deviceData,
      companyId,
    });

    const res = await axios.post("/devices", payload, {
      headers: getAuthHeaders(),
    });

    dispatch({
      type: actionTypes.CREATE_VEHICLE_SUCCESS,
      payload: res.data.data || payload,
    });

    toast.success(res.data?.message || "Device created successfully!");
    if (navigate) navigate(`/settings/devices/${companyId}`);
    return true;
  } catch (err) {
    dispatch({
      type: actionTypes.CREATE_VEHICLE_FAILURE,
      payload: err.response?.data?.message || err.message,
    });
    toast.error(err.response?.data?.message || "Failed to create device");
    return false;
  }
};
  
  // Unassign camera device from vehicle
  export const unassignEld = (companyId, id, navigate) => async (dispatch) => {
    try {
      dispatch({ type: actionTypes.UNASSIGN_ELD_REQUEST });
  
      const res = await axios.put(`/vehicles/unassign-eld?companyId=${companyId}&vehicleId=${id}`, {}, {
        headers: getAuthHeaders(),
      });
  
      dispatch({
        type: actionTypes.UNASSIGN_ELD_SUCCESS,
        payload: res.data.data,
      });
  
      toast.success("Camera device unassigned successfully!");
      if (navigate) navigate(`/settings/devices/${companyId}`);
      return true;
    } catch (err) {
      dispatch({
        type: actionTypes.UNASSIGN_ELD_FAILURE,
        payload: err.response?.data?.message || err.message,
      });
      toast.error(err.response?.data?.message || "Failed to unassign camera device");
      return false;
    }
  };
  
// Delete vehicle
export const deleteVehicle = (companyId, id, navigate) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.DELETE_VEHICLE_REQUEST });
    await axios.delete(`/vehicles?companyId=${companyId}&vehicleId=${id}`, {
      headers: getAuthHeaders(),
    });

    // just remove from redux by id
    dispatch({ type: actionTypes.DELETE_VEHICLE_SUCCESS, payload: id });
    toast.success("Vehicle deleted successfully!");
    if (navigate) navigate(`/settings/devices/${companyId}`);

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
        headers: getAuthHeaders(),
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

//getAllActiveVehicles
export const getAllActiveVehicles = (companyId) => async (dispatch) => {
  try {
    dispatch({ type: actionTypes.START_ALL_ACTIVE_VEHICLES });

    const res = await axios.get(
      `/vehicles/getAllActivevehicles?companyId=${companyId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    console.log("All active vehicles:", res.data.data);

    dispatch({
      type: actionTypes.ALL_ACTIVE_VEHICLES_SUCCESS,
      payload: res.data.data,
    });
  } catch (err) {
    console.error("Error fetching all active vehicles:", err);

    dispatch({
      type: actionTypes.ALL_ACTIVE_VEHICLES_FAIL,
      payload: err.response?.data?.message || err.message,
    });

    toast.error(err.response?.data?.message || "Failed to fetch active vehicles");
  }
};

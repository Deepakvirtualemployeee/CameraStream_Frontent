import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";


export const createIFTAReport = (companyId, vehicleId, startDate, endDate) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({ type: actionTypes.CREATE_IFTA_REPORT_REQUEST });

    if (!companyId) {
      throw new Error("Missing companyId");
    }
    if (!vehicleId) {
      throw new Error("Missing vehicleId");
    }

    // Convert input to YYYY-MM-DD if it's a Date; otherwise pass through.
    const toYMD = (d) => {
      if (!d) return undefined;
      if (typeof d === "string") return d;
      if (d instanceof Date && !isNaN(d)) return d.toISOString().split("T")[0];
      throw new Error("Invalid date value");
    };

    const body = {
      vehicleId,
      startDate: toYMD(startDate),
      endDate: toYMD(endDate),
      tz: "America/Los_Angeles",
    };

    const { data } = await axios.post(`/createReport/${companyId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    dispatch({
      type: actionTypes.CREATE_IFTA_REPORT_SUCCESS,
      payload: data, // recordId
    });
    return data.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CREATE_IFTA_REPORT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    return null;
  }
};



export const getIFTAReportDetails = (recordId) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({ type: actionTypes.GET_IFTA_REPORT_DETAILS_REQUEST });

    const { data } = await axios.get(`/details?recordId=${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: actionTypes.GET_IFTA_REPORT_DETAILS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: actionTypes.GET_IFTA_REPORT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

 
export const downloadIFTAReport = (recordId) => async (dispatch) => {
  const token = localStorage.getItem("token");

  try {
    dispatch({ type: actionTypes.DOWNLOAD_IFTA_REPORT_REQUEST });

    const response = await axios.get(`/generateReport?recordId=${recordId}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",  
    });

 
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

   
  
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `IFTA_Report_${recordId}.docx`; 
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(link.href);  
      dispatch({ type: actionTypes.DOWNLOAD_IFTA_REPORT_SUCCESS });
  } catch (error) {
    dispatch({
      type: actionTypes.DOWNLOAD_IFTA_REPORT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};


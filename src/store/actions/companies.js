import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
import { getTenantId } from "../../utils/tenant";

const getAuthConfig = () => ({
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeTerminals = (terminals = [], fallbackTimeZoneId = "") => {
  if (!Array.isArray(terminals)) return [];

  return terminals
    .map((terminal) => ({
      ...terminal,
      timeZone: terminal?.timeZone || terminal?.timeZoneId || fallbackTimeZoneId,
      address: terminal?.address || "",
    }))
    .filter((terminal) => terminal.address || terminal.timeZone);
};

const buildCreateCompanyPayload = (data = {}) => ({
  companyName: data.companyName || "",
  dotNumber: data.dotNumber || "",
  timeZoneId: data.timeZoneId || "",
  address: data.address || "",
  phoneNumber: data.phoneNumber || "",
  email: data.email || "",
  terminals: normalizeTerminals(data.terminals, data.timeZoneId),
});

const buildUpdateCompanyPayload = (data = {}) => ({
  companyName: data.companyName || "",
  dotNumber: data.dotNumber || "",
  timeZoneId: data.timeZoneId || "",
  address: data.address || "",
  terminals: normalizeTerminals(data.terminals, data.timeZoneId),
  complianceMode: data.complianceMode || "ELD",
  hosRules: data.hosRules || "70/8",
  cargoType: data.cargoType || "PROPERTY",
  restartHours: data.restartHours || "34",
  restBreak: data.restBreak || "30",
  allowShortHaul: data.allowShortHaul ?? false,
  allowSplitSleeper: data.allowSplitSleeper ?? false,
  allowPersonalConveyance: data.allowPersonalConveyance ?? false,
  allowYardMove: data.allowYardMove ?? false,
  allowManualDriver: data.allowManualDriver ?? false,
  restrictDriverFromCreationDate: data.restrictDriverFromCreationDate ?? false,
});

// Start loading
export const startCompanies = () => ({
  type: actionTypes.START_COMPANIES
});

// Success
export const companiesSuccess = (data, message = null) => {
  if (message) toast.success(message);
  return {
    type: actionTypes.COMPANIES_SUCCESS,
    payload: data,
    message
  };
};

// Failure
export const companiesFail = (message) => {
  toast.error(message);
  return {
    type: actionTypes.COMPANIES_FAIL,
    message
  };
};

// Action Creators
export const startCompanyInfo = () => ({
  type: actionTypes.START_COMPANY_INFO,
});

export const companyInfoSuccess = (data) => ({
  type: actionTypes.COMPANY_INFO_SUCCESS,
  payload: data,
});

export const companyInfoError = (error) => ({
  type: actionTypes.COMPANY_INFO_ERROR,
  payload: error,
});

// Fetch company info
export const getCompanyInfo = (companyId) => {
  return async (dispatch) => {
    dispatch(startCompanyInfo());
    try {
      const res = await axios.get(`/companies/by-id?id=${companyId}`, getAuthConfig());
      console.log("Edit company:", res);
      dispatch(companyInfoSuccess(res.data?.data || {}));
    } catch (err) {
      dispatch(companyInfoError(err.response?.data?.message || "Error fetching company info"));
    }
  };
};

// Update company details
export const updateCompanyById = (companyId, companyData, navigate) => {
  return async (dispatch) => {
    try {
      dispatch({ type: actionTypes.UPDATE_COMPANY_REQUEST });

      const payload = buildUpdateCompanyPayload(companyData);
      const { data } = await axios.put(`/companies?id=${companyId}`, payload, getAuthConfig());
      console.log("Update company data:", payload);
      console.log("Update company res:", data);
      dispatch({
        type: actionTypes.UPDATE_COMPANY_SUCCESS,
        payload: data,
      });
      toast.success(data?.message || "Company details updated successfully!");
      if (navigate) navigate(`/settings/company-info/${companyId}`);
      return data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      dispatch({
        type: actionTypes.UPDATE_COMPANY_FAIL,
        payload: message,
      });
      toast.error(message || "Failed to update company");
      throw error;
    }
  };
};

// GET all companies
export const getCompanies = () => {
  return (dispatch) => {
    dispatch(startCompanies());
    axios.get("/companies?page=1&limit=10", getAuthConfig())
      .then(res => {
        console.log("Companies:", res.data);
        const companies =
          res.data?.data?.docs ||
          res.data?.data?.companies ||
          res.data?.data?.items ||
          res.data?.companies ||
          res.data?.data ||
          [];
        dispatch(companiesSuccess(companies));
      })
      .catch(err => {
        dispatch(companiesFail(err?.response?.data?.message || "Failed to fetch companies"));
      });
  };
};

// POST create company
export const createCompany = (data, callback) => {
  return (dispatch) => {
    dispatch(startCompanies());

    if (!getTenantId()) {
      const message = "Tenant ID is missing. Set REACT_APP_TENANT_ID in .env before calling company APIs.";
      dispatch(companiesFail(message));
      if (callback) callback(message);
      return Promise.reject(message);
    }

    const payload = buildCreateCompanyPayload(data);

    return axios.post("/companies", payload, getAuthConfig())
      .then(res => {
        console.log(res);
        dispatch(companiesSuccess(null, res.data.message || "Company created successfully"));

        if (callback) callback();

        dispatch(getCompanies());
        return res.data;
      })
      .catch(err => {
        const message = err?.response?.data?.message || "Failed to create company";
        console.log(err);
        dispatch(companiesFail(message));
        if (callback) callback(message);
        return Promise.reject(message);
      });
  };
};

// PUT update company
export const updateCompany = (id, data, callback) => {
  return (dispatch) => {
    dispatch(startCompanies());
    const payload = buildUpdateCompanyPayload(data);

    return axios.put(`/companies?id=${id}`, payload, getAuthConfig())
      .then(res => {
        dispatch(companiesSuccess(null, res.data.message || "Company updated successfully"));
        if (callback) callback();
        dispatch(getCompanies());
        return res.data;
      })
      .catch(err => {
        const message = err?.response?.data?.message || "Failed to update company";
        dispatch(companiesFail(message));
        if (callback) callback(message);
        return Promise.reject(message);
      });
  };
};

// DELETE company
export const deleteCompany = (id) => {
  return async (dispatch) => {
    try {
      dispatch(startCompanies());
      const res = await axios.delete(`/companies?id=${id}`, getAuthConfig());

      dispatch({
        type: actionTypes.DELETE_COMPANY_SUCCESS,
        payload: id,
        message: res?.data?.message || "Company deleted successfully",
      });

      toast.success(res?.data?.message || "Company deleted successfully");
      return res?.data;
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete company";
      dispatch(companiesFail(message));
      throw err;
    }
  };
};

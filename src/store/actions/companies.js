import * as actionTypes from "../actions/actionTypes";
import axios from "../../axios-config";
import { toast } from "react-toastify";
const token = localStorage.getItem("token");

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

// GET all companies
export const getCompanies = () => {
  return (dispatch) => {
    dispatch(startCompanies());
    axios.get("/companies",
      {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      }
    )
      .then(res => {
        console.log("Companies:", res.data);
        dispatch(companiesSuccess(res.data.data));
      })
      .catch(err => {
        dispatch(companiesFail(err?.response?.data?.message || "Failed to fetch companies"));
      });
  };
};

// GET companies with search
export const searchCompanies = (query) => {
  return (dispatch) => {
    dispatch(startCompanies());
    axios.get(`/companies?search=${encodeURIComponent(query)}`,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      })
      .then(res => {
        dispatch(companiesSuccess(res.data.data.companies));
      })
      .catch(err => {
        dispatch(companiesFail(err?.response?.data?.message || "Search failed"));
      });
  };
};

// GET companies by status
export const filterCompaniesByStatus = (status) => {
  return (dispatch) => {
    dispatch(startCompanies());
    axios.get(`/companies?status=${encodeURIComponent(status)}`,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      })
      .then(res => {
        dispatch(companiesSuccess(res.data.data.companies));
      })
      .catch(err => {
        dispatch(companiesFail(err?.response?.data?.message || "Status filter failed"));
      });
  };
};

// POST create company
export const createCompany = (data, callback) => {
  return (dispatch) => {
    dispatch(startCompanies());

    const token = localStorage.getItem("token");

    axios.post(`/companies`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      console.log(res);
      dispatch(companiesSuccess(null, res.data.message || "Company created successfully"));
      
      // Run callback if provided
      if (callback) callback();

      // Refresh list after creation
      dispatch(getCompanies());
    })
    .catch(err => {
      console.log(err);
      dispatch(companiesFail(err?.response?.data?.message || "Failed to create company"));
    });
  };
};

// PUT update company
export const updateCompany = (id, data, callback) => {
  return (dispatch) => {
    dispatch(startCompanies());
    axios.put(`/companies/${id}`, data,{
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
          }
      })
      .then(res => {
        dispatch(companiesSuccess(null, res.data.message || "Company updated successfully"));
        if (callback) callback();
        dispatch(getCompanies());
      })
      .catch(err => {
        dispatch(companiesFail(err?.response?.data?.message || "Failed to update company"));
      });
  };
};

// DELETE company
export const deleteCompany = (id) => {
  return async (dispatch) => {
    try {
      dispatch(startCompanies());
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/companies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      dispatch({
        type: actionTypes.DELETE_COMPANY_SUCCESS,
        payload: id,
        message: res?.data?.message || "Company deleted successfully",
      });

      toast.success(res?.data?.message || "Company deleted successfully");
    } catch (err) {
      dispatch(companiesFail(err?.response?.data?.message || "Failed to delete company"));
    }
  };
};
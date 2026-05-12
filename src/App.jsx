import React, { Suspense, lazy, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { restoreUserFromLocalStorage } from "./store/actions/auth";

const LogIn = lazy(() => import("./pages/authentication/LogIn"));
const SignUp = lazy(() => import("./pages/authentication/SignUp"));
const SignupFinished = lazy(() =>
  import("./pages/authentication/SignupFinished").then((module) => ({
    default: module.SignupFinished,
  }))
);
const ForgotPassword = lazy(() => import("./pages/authentication/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/authentication/VerifyEmail"));

const Layout = lazy(() =>
  import("./components/layouts/Layout").then((module) => ({
    default: module.Layout,
  }))
);
const Layout2 = lazy(() =>
  import("./components/layouts/Layout2").then((module) => ({
    default: module.Layout2,
  }))
);

const CompaniesList = lazy(() =>
  import("./pages/company-list/CompaniesList").then((module) => ({
    default: module.CompaniesList,
  }))
);
const CreateCompany = lazy(() => import("./pages/company-list/CreateCompany"));
const UsersManagement = lazy(() =>
  import("./pages/system-users-management/UsersManagement").then((module) => ({
    default: module.UsersManagement,
  }))
);
const AddUser = lazy(() =>
  import("./pages/system-users-management/AddUser").then((module) => ({
    default: module.AddUser,
  }))
);
const EditUserInfo = lazy(() =>
  import("./pages/system-users-management/EditUserInfo").then((module) => ({
    default: module.EditUserInfo,
  }))
);
const FmcsaTransfer = lazy(() =>
  import("./pages/fmcsa-transfer/FmcsaTransfer").then((module) => ({
    default: module.FmcsaTransfer,
  }))
);
const PageNotFound = lazy(() =>
  import("./pages/PageNotFound").then((module) => ({
    default: module.PageNotFound,
  }))
);
const BillingManagement = lazy(() =>
  import("./pages/billing-management/BillingManagement").then((module) => ({
    default: module.BillingManagement,
  }))
);
const DrivenHours = lazy(() =>
  import("./pages/driven-hours/DrivenHours").then((module) => ({
    default: module.DrivenHours,
  }))
);
const GroupManagement = lazy(() =>
  import("./pages/group-management/GroupManagement").then((module) => ({
    default: module.GroupManagement,
  }))
);
const AddGroup = lazy(() =>
  import("./pages/group-management/AddGroup").then((module) => ({
    default: module.AddGroup,
  }))
);
const CompanyViolations = lazy(() =>
  import("./pages/company-violations/CompanyViolations").then((module) => ({
    default: module.CompanyViolations,
  }))
);
const AppFeedback = lazy(() =>
  import("./pages/app-feedback/AppFeedback").then((module) => ({
    default: module.AppFeedback,
  }))
);
const Resources = lazy(() =>
  import("./pages/resources-section/Resources").then((module) => ({
    default: module.Resources,
  }))
);
const DriversList = lazy(() =>
  import("./pages/drivers-list/DriversList").then((module) => ({
    default: module.DriversList,
  }))
);
const VideoLibrary = lazy(() =>
  import("./pages/AdminSection/VideoLibrary/VideoLibrary").then((module) => ({
    default: module.VideoLibrary,
  }))
);
const Location = lazy(() =>
  import("./pages/AdminSection/Locations/Location").then((module) => ({
    default: module.Location,
  }))
);
const DriversListing = lazy(() =>
  import("./pages/settings-section/Drivers/DriversListing").then((module) => ({
    default: module.DriversListing,
  }))
);
const AddDriver = lazy(() =>
  import("./pages/settings-section/Drivers/AddDriver").then((module) => ({
    default: module.AddDriver,
  }))
);
const EditDriver = lazy(() =>
  import("./pages/settings-section/Drivers/EditDriver").then((module) => ({
    default: module.EditDriver,
  }))
);
const CameraDevice = lazy(() =>
  import("./pages/settings-section/CameraDevice/CameraDevice").then((module) => ({
    default: module.CameraDevice,
  }))
);
const AddCameraDevice = lazy(() =>
  import("./pages/settings-section/CameraDevice/AddCameraDevice").then((module) => ({
    default: module.AddCameraDevice,
  }))
);
const EditCameraDevice = lazy(() =>
  import("./pages/settings-section/CameraDevice/EditCameraDevice").then((module) => ({
    default: module.EditCameraDevice,
  }))
);
const VehiclesList = lazy(() =>
  import("./pages/settings-section/Vehicles/VehiclesList").then((module) => ({
    default: module.VehiclesList,
  }))
);
const AddVehicles = lazy(() =>
  import("./pages/settings-section/Vehicles/AddVehicles").then((module) => ({
    default: module.AddVehicles,
  }))
);
const EditVehicles = lazy(() =>
  import("./pages/settings-section/Vehicles/EditVehicles").then((module) => ({
    default: module.EditVehicles,
  }))
);
const CompanyInfo = lazy(() =>
  import("./pages/settings-section/Company/CompanyInfo").then((module) => ({
    default: module.CompanyInfo,
  }))
);
const EditCompanyInfo = lazy(() =>
  import("./pages/settings-section/Company/EditCompanyInfo").then((module) => ({
    default: module.EditCompanyInfo,
  }))
);
const PortalUsers = lazy(() =>
  import("./pages/settings-section/Portal-Users/PortalUsers").then((module) => ({
    default: module.PortalUsers,
  }))
);
const AddPortalUser = lazy(() =>
  import("./pages/settings-section/Portal-Users/AddPortalUser").then((module) => ({
    default: module.AddPortalUser,
  }))
);
const EditPortalUser = lazy(() =>
  import("./pages/settings-section/Portal-Users/EditPortalUser").then((module) => ({
    default: module.EditPortalUser,
  }))
);

const RouteLoader = () => (
  <div className="d-flex align-items-center justify-content-center py-5">
    <div className="text-center text-muted">
      <div className="spinner-border spinner-border-sm mb-2" role="status" />
      <div>Loading...</div>
    </div>
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreUserFromLocalStorage());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup-finished" element={<SignupFinished />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="companies-list" element={<CompaniesList />} />
            <Route path="system-users-management" element={<UsersManagement />} />
            <Route path="fmcsa-transfer" element={<FmcsaTransfer />} />
            <Route path="billing-management" element={<BillingManagement />} />
            <Route path="driven-hours" element={<DrivenHours />} />
            <Route path="group-management" element={<GroupManagement />} />
            <Route path="company-violations" element={<CompanyViolations />} />
            <Route path="app-feedback" element={<AppFeedback />} />
            <Route path="resource" element={<Resources />} />
            <Route path="drivers-list" element={<DriversList />} />
            <Route path="companies-list/create-company" element={<CreateCompany />} />
            <Route path="system-users-management/add-user" element={<AddUser />} />
            <Route path="system-users-management/edit-user-info" element={<EditUserInfo />} />
            <Route path="group-management/add-group" element={<AddGroup />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout2 />
              </ProtectedRoute>
            }
          >
            <Route path="video-library/:companyId" element={<VideoLibrary />} />
            <Route path="location/:companyId" element={<Location />} />
            <Route path="settings/drivers-listing/:companyId" element={<DriversListing />} />
            <Route path="settings/drivers-listing/add-driver/:companyId" element={<AddDriver />} />
            <Route path="settings/drivers-listing/edit-driver/:companyId/:id" element={<EditDriver />} />
            <Route path="settings/devices/:companyId" element={<CameraDevice />} />
            <Route path="settings/devices/add-device/:companyId" element={<AddCameraDevice />} />
            <Route path="settings/devices/edit-device/:companyId/:id" element={<EditCameraDevice />} />
            <Route path="settings/camera-devices/:companyId" element={<CameraDevice />} />
            <Route path="settings/camera-devices/add-device/:companyId" element={<AddCameraDevice />} />
            <Route path="settings/camera-devices/edit-device/:companyId/:id" element={<EditCameraDevice />} />
            <Route path="settings/vehicles-list/:companyId" element={<VehiclesList />} />
            <Route path="settings/vehicles-list/add-vehicle/:companyId" element={<AddVehicles />} />
            <Route path="settings/vehicles-list/edit-vehicle/:companyId/:id" element={<EditVehicles />} />
            <Route path="settings/company-info/:companyId" element={<CompanyInfo />} />
            <Route path="settings/company-info/edit-company-info/:companyId" element={<EditCompanyInfo />} />
            <Route path="settings/portal-users/:companyId" element={<PortalUsers />} />
            <Route path="settings/portal-users/add-portal-user/:companyId" element={<AddPortalUser />} />
            <Route path="settings/portal-users/edit-portal-user/:companyId/:id" element={<EditPortalUser />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

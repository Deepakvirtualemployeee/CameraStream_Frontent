import React , {useEffect} from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector , useDispatch } from "react-redux";
 
import { restoreUserFromLocalStorage } from './store/actions/auth'; 


// Auth Pages
import LogIn from './pages/authentication/LogIn';
import SignUp from './pages/authentication/SignUp';
import { SignupFinished } from './pages/authentication/SignupFinished';
import ForgotPassword from './pages/authentication/ForgotPassword';
import VerifyEmail from './pages/authentication/VerifyEmail'

// Main Layout and Pages
import { Layout } from './components/layouts/Layout';
// import { Dashboard } from './pages/Dashboard';
import { CompaniesList } from './pages/company-list/CompaniesList';
import CreateCompany from './pages/company-list/CreateCompany';

import { UsersManagement } from './pages/system-users-management/UsersManagement';
import { AddUser } from './pages/system-users-management/AddUser';
import { EditUserInfo } from './pages/system-users-management/EditUserInfo';

import { FmcsaTransfer } from './pages/fmcsa-transfer/FmcsaTransfer';
import { PageNotFound } from './pages/PageNotFound';
import { BillingManagement } from './pages/billing-management/BillingManagement';
import { DrivenHours } from './pages/driven-hours/DrivenHours';

import { GroupManagement } from './pages/group-management/GroupManagement';
import { AddGroup } from './pages/group-management/AddGroup';

import { CompanyViolations } from './pages/company-violations/CompanyViolations';
import { AppFeedback } from './pages/app-feedback/AppFeedback';
import { Resources } from './pages/resources-section/Resources';
import { DriversList } from './pages/drivers-list/DriversList';

// Admin Section Layout Pages
import { DriversHOSList } from './pages/AdminSection/DriverHOS/DriversHOSList';
import { GraphDetails } from './pages/AdminSection/DriverHOS/GraphDetails';
import { FMCSARecords } from './pages/AdminSection/FMCSA-Reports/FMCSA-Reports';
import { LogsList } from './pages/AdminSection/LogsSection/LogsList';
import { Location } from './pages/AdminSection/Locations/Location';
import { AddEvent } from './pages/AdminSection/DriverHOS/AddEvent';
import { EditEvent } from './pages/AdminSection/DriverHOS/EditEvent';
import { UnidentifiedEvents } from './pages/AdminSection/UnidentifiedEvents/UnidentifiedEvents';
import { DriversListing } from './pages/settings-section/Drivers/DriversListing';
import { AddDriver } from './pages/settings-section/Drivers/AddDriver';
import { EditDriver } from './pages/settings-section/Drivers/EditDriver';
import { ELDDevice } from './pages/settings-section/ELD-Devices/ELDDevice';
import { AddELDDevice } from './pages/settings-section/ELD-Devices/AddELDDevice';
import { EditELDDevice } from './pages/settings-section/ELD-Devices/EditELDDevice';
import { Layout2 } from './components/layouts/Layout2';
import { VehiclesList } from './pages/settings-section/Vehicles/VehiclesList';
import { AddVehicles } from './pages/settings-section/Vehicles/AddVehicles';
import { EditVehicles } from './pages/settings-section/Vehicles/EditVehicles';
import { CompanyInfo } from './pages/settings-section/Company/CompanyInfo';
import { EditCompanyInfo } from './pages/settings-section/Company/EditCompanyInfo';
import { PortalUsers } from './pages/settings-section/Portal-Users/PortalUsers';
import { AddPortalUser } from './pages/settings-section/Portal-Users/AddPortalUser';
import { EditPortalUser } from './pages/settings-section/Portal-Users/EditPortalUser';
// import { ResourcesList } from './pages/settings-section/Resources/ResourcesList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/ProtectedRoute";
import {IFTAReports} from './pages/AdminSection/IFTA-Reports/IFTA-Reports';



function App() {
    const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.userDetails?.role);
 
  useEffect(() => {
    console.log("User Role in App.jsx useEffect:", userRole);
    
    dispatch(restoreUserFromLocalStorage());
  }, [dispatch]);
  
  //   const { userDetails } = useSelector((state) => state.auth);
  //   console.log("User Details in App.jsx:", userDetails);
  // const userRole = userDetails?.role;
  // console.log("User Role in App.jsx:", userRole); //
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Auth Routes */}
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-finished" element={<SignupFinished />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* <Route path="/companies-list/create-company" element={<CreateCompany />} />

        <Route path="/system-users-management/add-user" element={<AddUser />} />
        <Route path="/system-users-management/edit-user-info" element={<EditUserInfo />} />

        <Route path="/group-management/add-group" element={<AddGroup />} /> */}

        {/* Main Layout Routes */}
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* <Route index element={<Dashboard />} /> */}
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
          <Route path="*" element={<PageNotFound />} />

          <Route path="/companies-list/create-company" element={<CreateCompany />} />
          <Route path="/system-users-management/add-user" element={<AddUser />} />
          <Route path="/system-users-management/edit-user-info" element={<EditUserInfo />} />
          <Route path="/group-management/add-group" element={<AddGroup />} />
        </Route>

        {/* Routes using Sidebar + Topbar */}
        <Route element={
          <ProtectedRoute>
            <Layout2 />
          </ProtectedRoute>
        }>
          <Route path="driver-hos/:companyId" element={<DriversHOSList />} />
          {/* <Route path="driver-hos/graph-details/:driverId" element={<GraphDetails />} /> */}
          <Route path="driver-hos/graph-details/:companyId/:driverId" element={<GraphDetails />} />
          <Route path="driver-hos/graph-details/add-event/:companyId/:driverId" element={<AddEvent />} />
          <Route path="driver-hos/graph-details/edit-event/:companyId/:driverId" element={<EditEvent />} />
          <Route path="logs/:companyId" element={<LogsList />} />
          <Route path="unidentified-events/:companyId" element={<UnidentifiedEvents />} />
          <Route path="fmcsa-records/:companyId" element={<FMCSARecords />} />
          <Route path="reports/ifta-reports/:companyId" element={<IFTAReports />} />
          <Route path="location/:companyId" element={<Location />} />
          <Route path="settings/drivers-listing/:companyId" element={<DriversListing />} />
          <Route path="settings/drivers-listing/add-driver/:companyId" element={<AddDriver />} />
          <Route path="settings/drivers-listing/edit-driver/:companyId/:id" element={<EditDriver />} />
          <Route path="settings/eld-devices/:companyId" element={<ELDDevice />} />
          <Route path="settings/eld-devices/add-device/:companyId" element={<AddELDDevice />} />
          <Route path="settings/eld-devices/edit-device/:companyId/:id" element={<EditELDDevice />} />
          <Route path="settings/vehicles-list/:companyId" element={<VehiclesList />} />
          <Route path="settings/vehicles-list/add-vehicle/:companyId" element={<AddVehicles />} />
          {/* <Route path="settings/vehicles-list/edit-vehicle" element={<EditVehicles />} /> */}
          <Route path="settings/vehicles-list/edit-vehicle/:companyId/:id" element={<EditVehicles />} />

          <Route path="settings/company-info/:companyId" element={<CompanyInfo />} />
          {/* <Route path="settings/company-info" element={<CompanyInfo />} /> */}

          <Route path="settings/company-info/edit-company-info/:companyId" element={<EditCompanyInfo />} />
          <Route path="settings/portal-users/:companyId" element={<PortalUsers />} />
          <Route path="settings/portal-users/add-portal-user/:companyId" element={<AddPortalUser />} />
          <Route path="settings/portal-users/edit-portal-user/:companyId/:id" element={<EditPortalUser />} />
          {/* <Route path="settings/resources" element={<ResourcesList />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

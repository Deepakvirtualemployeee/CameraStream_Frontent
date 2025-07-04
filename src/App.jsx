import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Auth Pages
import { LogIn } from './pages/authentication/LogIn';
import { SignUp } from './pages/authentication/SignUp';
import { SignupFinished } from './pages/authentication/SignupFinished';
import { ForgotPassword } from './pages/authentication/ForgotPassword';

// Main Layout and Pages
import { Layout } from './components/layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import { CompaniesList } from './pages/company-list/CompaniesList';

import { UsersManagement } from './pages/system-users-management/UsersManagement';
import { AddUser } from './pages/system-users-management/AddUser';
import { EditUserInfo } from './pages/system-users-management/EditUserInfo';

import { UserDetails } from './pages/system-users-management/UserDetails';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-finished" element={<SignupFinished />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="system-users-management/add-user" element={<AddUser />} />
        <Route path="system-users-management/edit-user-info" element={<EditUserInfo />} />

         <Route path="group-management/add-group" element={<AddGroup />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="companies-list" element={<CompaniesList />} />
          <Route path="system-users-management" element={<UsersManagement />} />
          <Route path="system-users-management/user-details" element={<UserDetails />} />
          <Route path="fmcsa-transfer" element={<FmcsaTransfer />} />
          <Route path="billing-management" element={<BillingManagement />} />
          <Route path="driven-hours" element={<DrivenHours />} />

          <Route path="group-management" element={<GroupManagement />} />
          <Route path="company-violations" element={<CompanyViolations />} />
          <Route path="app-feedback" element={<AppFeedback />} />
          <Route path="resource" element={<Resources />} />
          <Route path="drivers-list" element={<DriversList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

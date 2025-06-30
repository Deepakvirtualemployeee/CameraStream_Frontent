import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
import { UserDetails } from './pages/system-users-management/UserDetails';
import { FmcsaTransfer } from './pages/fmcsa-transfer/FmcsaTransfer';
import { PageNotFound } from './pages/PageNotFound';
import { BillingManagement } from './pages/billing-management/BillingManagement';
import { GroupManagement } from './pages/group-management/GroupManagement';
import { AppFeedback } from './pages/app-feedback/AppFeedback';
import { DriversList } from './pages/drivers-list/DriversList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-finished" element={<SignupFinished />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Dashboard />} /> */}
          {/* <Route index path="companies-list" element={<CompaniesList />} /> */}
          <Route index element={<CompaniesList />} />
          <Route path="system-users-management" element={<UsersManagement />} />
          <Route path="system-users-management/user-details" element={<UserDetails />} />
          <Route path="fmcsa-transfer" element={<FmcsaTransfer />} />
          <Route path="billing-management" element={<BillingManagement />} />
          <Route path="group-management" element={<GroupManagement />} />
          <Route path="app-feedback" element={<AppFeedback />} />
          <Route path="drivers-list" element={<DriversList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Auth Pages
import { SignUp } from './pages/authentication/SignUp';
import { LogIn } from './pages/authentication/LogIn';
import { ForgotPassword } from './pages/authentication/ForgotPassword';

// Main Layout and Pages
import { Layout } from './components/layouts/Layout';
import { Dashboard } from './pages/Dashboard';
import { UsersManagement } from './pages/system-users-management/UsersManagement';
import { AddUser } from './pages/system-users-management/AddUser';
import { UserDetails } from './pages/system-users-management/UserDetails';
import { CompaniesList } from './pages/company-list/CompaniesList';
import { PageNotFound } from './pages/PageNotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="system-users-management" element={<UsersManagement />} />
          <Route path="system-users-management/add-user" element={<AddUser />} />
          <Route path="system-users-management/user-details" element={<UserDetails />} />
          <Route path="companies-list" element={<CompaniesList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

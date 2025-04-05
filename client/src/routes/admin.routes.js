import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Reports from '../Components/Admin/Reports';
import Settings from '../Components/Admin/Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;

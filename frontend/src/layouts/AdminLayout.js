import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from '../pages/admin/AdminDashboard'
import NewsDashboard from '../pages/admin/NewsDashboard'

const AdminLayout = () => {
  return (
    <Routes>
      <Route path="dashboard/*" element={<AdminDashboard />} />
      <Route path="news/dashboard" element={<NewsDashboard />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  )
}

export default AdminLayout
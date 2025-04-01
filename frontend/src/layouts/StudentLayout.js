import React from 'react'
import { Navigate } from 'react-router-dom'

const StudentLayout = () => {
  return (
    <div>
      {/* Thêm nội dung layout cho student tại đây */}
      <Navigate to="/student/dashboard" />
    </div>
  )
}

export default StudentLayout
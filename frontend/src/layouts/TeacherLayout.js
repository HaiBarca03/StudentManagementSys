import React from 'react'
import { Navigate } from 'react-router-dom'

const TeacherLayout = () => {
  return (
    <div>
      {/* Thêm nội dung layout cho teacher tại đây */}
      <Navigate to="/teacher/dashboard" />
    </div>
  )
}

export default TeacherLayout
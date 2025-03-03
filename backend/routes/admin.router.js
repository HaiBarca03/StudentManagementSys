const express = require('express')
const adminRouter = express.Router()
const {
  adminRegister,
  adminLogIn,
  deleteAdmin,
  getAdminDetail,
  updateAdmin
} = require('../controllers/admin-controller.js')

adminRouter.post('/AdminReg', adminRegister)
adminRouter.post('/AdminLogin', adminLogIn)
adminRouter.get('/Admin/:id', getAdminDetail)
adminRouter.delete('/Admin/:id', deleteAdmin)
adminRouter.put('/Admin/:id', updateAdmin)

module.exports = adminRouter

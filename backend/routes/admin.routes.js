const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getCompanies,
  approveCompany,
  rejectCompany,
  getAllApplications,
  getStats,
  getAllUsers,
} = require('../controllers/admin.controller');

const router = express.Router();

// All routes require authentication + admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/companies
router.get('/companies', getCompanies);

// @route   PUT /api/admin/companies/:id/approve
router.put('/companies/:id/approve', approveCompany);

// @route   PUT /api/admin/companies/:id/reject
router.put('/companies/:id/reject', rejectCompany);

// @route   GET /api/admin/applications
router.get('/applications', getAllApplications);

// @route   GET /api/admin/stats
router.get('/stats', getStats);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

module.exports = router;

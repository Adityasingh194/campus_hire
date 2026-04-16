const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');
const {
  updateProfile,
  uploadResume,
  browseJobs,
  getJobDetails,
  applyToJob,
  getMyApplications,
} = require('../controllers/student.controller');

const router = express.Router();

// All routes require authentication + student role
router.use(protect, authorize('student'));

// @route   PUT /api/students/profile
router.put('/profile', updateProfile);

// @route   POST /api/students/resume
router.post('/resume', upload.single('resume'), uploadResume);

// @route   GET /api/students/jobs
router.get('/jobs', browseJobs);

// @route   GET /api/students/jobs/:id
router.get('/jobs/:id', getJobDetails);

// @route   POST /api/students/jobs/:id/apply
router.post('/jobs/:id/apply', applyToJob);

// @route   GET /api/students/applications
router.get('/applications', getMyApplications);

module.exports = router;

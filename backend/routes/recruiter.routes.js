const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  registerCompany,
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getApplicants,
  updateApplicationStatus,
  browseStudents,
} = require('../controllers/recruiter.controller');

const router = express.Router();

// All routes require authentication + recruiter role
router.use(protect, authorize('recruiter'));

// @route   POST /api/recruiters/company
router.post(
  '/company',
  [body('name', 'Company name is required').notEmpty().trim()],
  registerCompany
);

// @route   POST /api/recruiters/jobs
router.post(
  '/jobs',
  [
    body('title', 'Job title is required').notEmpty().trim(),
    body('description', 'Job description is required').notEmpty(),
    body('type')
      .optional()
      .isIn(['internship', 'full-time', 'part-time'])
      .withMessage('Job type must be internship, full-time, or part-time'),
  ],
  postJob
);

// @route   GET /api/recruiters/jobs
router.get('/jobs', getMyJobs);

// @route   PUT /api/recruiters/jobs/:id
router.put('/jobs/:id', updateJob);

// @route   DELETE /api/recruiters/jobs/:id
router.delete('/jobs/:id', deleteJob);

// @route   GET /api/recruiters/jobs/:id/applicants
router.get('/jobs/:id/applicants', getApplicants);

// @route   PUT /api/recruiters/applications/:id/status
router.put('/applications/:id/status', updateApplicationStatus);

// @route   GET /api/recruiters/students
router.get('/students', browseStudents);

module.exports = router;

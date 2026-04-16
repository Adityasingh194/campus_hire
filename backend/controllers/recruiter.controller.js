const { validationResult } = require('express-validator');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Register a company
// @route   POST /api/recruiters/company
// @access  Private (Recruiter)
const registerCompany = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, website, industry } = req.body;

    // Check if recruiter already has a company
    if (req.user.company) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered a company',
      });
    }

    const company = await Company.create({
      name,
      description,
      website,
      industry,
      registeredBy: req.user.id,
    });

    // Link company to recruiter
    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully. Awaiting admin approval.',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Post a new job
// @route   POST /api/recruiters/jobs
// @access  Private (Recruiter)
const postJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Check recruiter has an approved company
    const recruiter = await User.findById(req.user.id).populate('company');
    if (!recruiter.company) {
      return res.status(400).json({
        success: false,
        message: 'Please register a company first',
      });
    }

    if (!recruiter.company.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Your company has not been approved by admin yet',
      });
    }

    const {
      title,
      description,
      type,
      location,
      salary,
      requirements,
      skillsRequired,
      deadline,
      openings,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      company: recruiter.company._id,
      postedBy: req.user.id,
      type,
      location,
      salary,
      requirements,
      skillsRequired,
      deadline,
      openings,
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View own posted jobs
// @route   GET /api/recruiters/jobs
// @access  Private (Recruiter)
const getMyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find({ postedBy: req.user.id })
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments({ postedBy: req.user.id });

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/recruiters/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Ensure recruiter owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job',
      });
    }

    const {
      title,
      description,
      type,
      location,
      salary,
      requirements,
      skillsRequired,
      deadline,
      openings,
      isActive,
    } = req.body;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        type,
        location,
        salary,
        requirements,
        skillsRequired,
        deadline,
        openings,
        isActive,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/recruiters/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Ensure recruiter owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    // Delete associated applications
    await Application.deleteMany({ job: job._id });

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job posting and associated applications deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View applicants for a job
// @route   GET /api/recruiters/jobs/:id/applicants
// @access  Private (Recruiter)
const getApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Ensure recruiter owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job',
      });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const filter = { job: job._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate({
        path: 'student',
        select: 'name email phone profile',
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (shortlist/accept/reject)
// @route   PUT /api/recruiters/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['shortlisted', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be shortlisted, accepted, or rejected',
      });
    }

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Ensure the recruiter owns the job this application belongs to
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    application.status = status;
    await application.save();

    res.json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Browse student profiles
// @route   GET /api/recruiters/students
// @access  Private (Recruiter)
const browseStudents = async (req, res, next) => {
  try {
    const { skills, search, minCgpa, page = 1, limit = 20 } = req.query;

    const filter = { role: 'student' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter['profile.skills'] = { $in: skillsArray };
    }

    if (minCgpa) {
      filter['profile.cgpa'] = { $gte: parseFloat(minCgpa) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCompany,
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getApplicants,
  updateApplicationStatus,
  browseStudents,
};

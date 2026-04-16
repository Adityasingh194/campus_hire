const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const path = require('path');

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const { bio, skills, education, experience, cgpa, phone, name } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // Build profile update
    const profileUpdate = {};
    if (bio !== undefined) profileUpdate['profile.bio'] = bio;
    if (skills !== undefined) profileUpdate['profile.skills'] = skills;
    if (education !== undefined) profileUpdate['profile.education'] = education;
    if (experience !== undefined) profileUpdate['profile.experience'] = experience;
    if (cgpa !== undefined) profileUpdate['profile.cgpa'] = cgpa;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updateData, ...profileUpdate },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/students/resume
// @access  Private (Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'profile.resumePath': req.file.path },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: {
        resumePath: req.file.path,
        fileName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Browse all active jobs
// @route   GET /api/students/jobs
// @access  Private (Student)
const browseJobs = async (req, res, next) => {
  try {
    const {
      type,
      search,
      skills,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const filter = { isActive: true };

    // Filter by job type
    if (type) {
      filter.type = type;
    }

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by required skills
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter.skillsRequired = { $in: skillsArray };
    }

    // Only show jobs from approved companies
    const Job = require('../models/Job');
    const Company = require('../models/Company');
    const approvedCompanies = await Company.find({ isApproved: true }).select('_id');
    const approvedCompanyIds = approvedCompanies.map((c) => c._id);
    filter.company = { $in: approvedCompanyIds };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const jobs = await Job.find(filter)
      .populate('company', 'name industry logo')
      .populate('postedBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

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

// @desc    Get single job details
// @route   GET /api/students/jobs/:id
// @access  Private (Student)
const getJobDetails = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name description website industry logo')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if the student has already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      student: req.user.id,
    });

    res.json({
      success: true,
      data: {
        ...job.toObject(),
        hasApplied: !!existingApplication,
        applicationStatus: existingApplication ? existingApplication.status : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to a job
// @route   POST /api/students/jobs/:id/apply
// @access  Private (Student)
const applyToJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications',
      });
    }

    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: job._id,
      student: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    const { coverLetter } = req.body;

    const application = await Application.create({
      job: job._id,
      student: req.user.id,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track all application statuses
// @route   GET /api/students/applications
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { student: req.user.id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate({
        path: 'job',
        select: 'title type location salary company deadline',
        populate: {
          path: 'company',
          select: 'name logo',
        },
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

module.exports = {
  updateProfile,
  uploadResume,
  browseJobs,
  getJobDetails,
  applyToJob,
  getMyApplications,
};

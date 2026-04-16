const Company = require('../models/Company');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    List all companies (filter by approval status)
// @route   GET /api/admin/companies
// @access  Private (Admin)
const getCompanies = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status === 'approved') filter.isApproved = true;
    if (status === 'pending') filter.isApproved = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const companies = await Company.find(filter)
      .populate('registeredBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Company.countDocuments(filter);

    res.json({
      success: true,
      data: companies,
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

// @desc    Approve a company registration
// @route   PUT /api/admin/companies/:id/approve
// @access  Private (Admin)
const approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    if (company.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Company is already approved',
      });
    }

    company.isApproved = true;
    await company.save();

    res.json({
      success: true,
      message: 'Company approved successfully',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a company (delete it)
// @route   PUT /api/admin/companies/:id/reject
// @access  Private (Admin)
const rejectCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Remove company reference from recruiter
    await User.findByIdAndUpdate(company.registeredBy, { $unset: { company: '' } });

    // Delete all jobs from this company
    const jobs = await Job.find({ company: company._id });
    const jobIds = jobs.map((j) => j._id);

    // Delete all applications for those jobs
    await Application.deleteMany({ job: { $in: jobIds } });

    // Delete all jobs
    await Job.deleteMany({ company: company._id });

    // Delete company
    await Company.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Company rejected and all associated data removed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Monitor all applications
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate({
        path: 'student',
        select: 'name email',
      })
      .populate({
        path: 'job',
        select: 'title type company',
        populate: {
          path: 'company',
          select: 'name',
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

// @desc    Get placement statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    // Total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalCompanies = await Company.countDocuments();
    const approvedCompanies = await Company.countDocuments({ isApproved: true });
    const pendingCompanies = await Company.countDocuments({ isApproved: false });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();

    // Application status breakdown
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Jobs by type
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top companies by applications
    const topCompanies = await Application.aggregate([
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobData',
        },
      },
      { $unwind: '$jobData' },
      {
        $lookup: {
          from: 'companies',
          localField: 'jobData.company',
          foreignField: '_id',
          as: 'companyData',
        },
      },
      { $unwind: '$companyData' },
      {
        $group: {
          _id: '$companyData._id',
          name: { $first: '$companyData.name' },
          applicationCount: { $sum: 1 },
        },
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 10 },
    ]);

    // Monthly applications trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Application.aggregate([
      {
        $match: {
          appliedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedAt' },
            month: { $month: '$appliedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Placement rate (accepted / total)
    const acceptedApplications = await Application.countDocuments({ status: 'accepted' });
    const placementRate =
      totalApplications > 0
        ? ((acceptedApplications / totalApplications) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalRecruiters,
          totalCompanies,
          approvedCompanies,
          pendingCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
          placementRate: `${placementRate}%`,
        },
        applicationsByStatus,
        jobsByType,
        topCompanies,
        monthlyTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('-password')
      .populate('company', 'name isApproved')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
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
  getCompanies,
  approveCompany,
  rejectCompany,
  getAllApplications,
  getStats,
  getAllUsers,
};

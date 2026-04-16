const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must reference a job'],
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must reference a student'],
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications: one student can apply to a job only once
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

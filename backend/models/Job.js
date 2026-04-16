const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [200, 'Job title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Job must belong to a company'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['internship', 'full-time', 'part-time'],
      default: 'full-time',
    },
    location: {
      type: String,
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },
    salary: {
      type: String,
      maxlength: [100, 'Salary info cannot exceed 100 characters'],
    },
    requirements: [String],
    skillsRequired: [String],
    deadline: {
      type: Date,
    },
    openings: {
      type: Number,
      default: 1,
      min: [1, 'Openings must be at least 1'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Job', jobSchema);

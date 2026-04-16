const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        'Please provide a valid URL',
      ],
    },
    industry: {
      type: String,
      maxlength: [100, 'Industry cannot exceed 100 characters'],
    },
    logo: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);

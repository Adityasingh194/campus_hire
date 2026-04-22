const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      default: 'student',
    },
    phone: {
      type: String,
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    // Student-specific profile fields
    profile: {
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
      },
      skills: [String],
      education: [
        {
          institution: String,
          degree: String,
          fieldOfStudy: String,
          startYear: Number,
          endYear: Number,
        },
      ],
      experience: [
        {
          company: String,
          title: String,
          description: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      resumePath: String,
      cgpa: {
        type: Number,
        min: [0, 'CGPA cannot be less than 0'],
        max: [10, 'CGPA cannot exceed 10'],
      },
    },
    // Recruiter-specific: linked company
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    dateJoined: {
      type: Date,
      required: true,
      default: Date.now(),
      immutable: true,
    },
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide your last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      lowercase: true,
      validate: [isEmail, "Please provide a valid email"],
      unique: [true, "Email is already in use by another user"],
    },
    phone: String,
    bio: String,
    password: {
      type: String,
      minlength: 8,
    },
    confirmPassword: {
      type: String,
      minlength: 8,
      validate: {
        // Custom validators only works for saving documents to the database and doesn't work for updating them
        // which is exactly what we want in this case since we'll only need to confirm the password during account creation
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and Confirm Password Fields do not match",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    strict: true,
    timestamps: true
  }
);

// Virtual Data that won't be persisted to mongo db
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.middleName ? this.middleName : ''} ${this.lastName}`
})

// Document Middleware
userSchema.pre("save", async function (next) {
  // Hash password and remove confirm password field if user document is newly created
  if (this.isNew) {
    // 1) Hash Password
    this.password = await bcrypt.hash(this.password, 12);
    // 2) Remove confirmPassword field
    this.confirmPassword = undefined;
  }
  next();
});

// Instance Methods
userSchema.methods.correctPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// MongoDB Indexing
userSchema.index({ email: -1 });

const User = model("User", userSchema, "users");

module.exports = User;

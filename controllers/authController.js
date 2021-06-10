const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const falsyData = require('./../utils/falsyData');
const sendResponse = require('./../utils/sendResponse');

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (data, statusCode, res) => {
  // Sign Token
  const token = signToken(data._id);
  // Remove Password from output
  data.password = undefined;
  // Set Cookie Options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Set Cookie to be sent over https if we're in production
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }
  // Send Token as cookie
  res.cookie('jwt', token, cookieOptions);
  // Send Response
  sendResponse(data, res, statusCode, {
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const userObj = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    bio: req.body.bio,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };

  const newUser = await User.create(userObj);

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    const user = await User.findOne({ email }).select(
      '+password'
    );
    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return falsyData(next, 'Email or password is incorrect', 400);
    }

    createAndSendToken(user, 200, res);
  } else {
    return falsyData(next, 'Please provide email and password');
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = null;
  // 1) Check if token exists and get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return falsyData(
      next,
      'You are not logged in! Please log in to access this resource',
      401
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return falsyData(
      next,
      `Can't find user with that token. Please try again`,
      401
    );
  }

  // Grant Access
  req.user = currentUser;
  next();
});
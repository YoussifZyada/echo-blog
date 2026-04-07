import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

// Helper to sign the JWT
const signToken = (id) => 
  jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
  });

export const register = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    // Create a token for the new user
    const token = signToken(newUser._id);

    // Remove password from output for security
    const user = newUser.toObject();
    delete user.password;

    res.status(201).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    // Remove password from output
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      status: 'success',
      token,
      data: { user: userObj }
    });
  } catch (err) {
    next(err);
  }
};
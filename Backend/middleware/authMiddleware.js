import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer') 
    ? req.headers.authorization.split(' ')[1] 
    : null;

  if (!token) return next(new AppError('Please login to access', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new AppError('Invalid token', 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Permission denied', 403));
    }
    next();
  };
};
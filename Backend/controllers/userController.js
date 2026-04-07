import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// Get Profile (Self or Admin)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(new AppError('User not found', 404));

    res.status(200).json({ status: 'success', data: user });
  } catch (err) { next(err); }
};

// Update User (Self or Super Admin)
export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) return next(new AppError('Use /updatePassword for password changes', 400));

    if (req.params.id !== req.user.id && req.user.role !== 'super-admin') {
      return next(new AppError('Permission denied', 403));
    }

    const filteredBody = { ...req.body };
    if (req.user.role !== 'super-admin') delete filteredBody.role;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (err) { next(err); }
};

// Delete User (Self or Super Admin)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id && req.user.role !== 'super-admin') {
      return next(new AppError('Permission denied', 403));
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};

// Get All Users (Admins only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ status: 'success', results: users.length, data: users });
  } catch (err) { next(err); }
};
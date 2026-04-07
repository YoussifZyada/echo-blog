import Group from '../models/Group.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

// 1. CREATE GROUP
export const createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;
    // Requirement: Group must have one or more admins
    const group = await Group.create({
      name,
      admins: [req.user.id], // Creator is the first admin
      members: [req.user.id]  // Creator is also a member
    });
    res.status(201).json(group);
  } catch (err) { next(err); }
};

// 2. ADD USER TO GROUP (Admin only)
export const addUserToGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return next(new AppError('Group not found', 404));

    // Permission Check: User must be Group Admin OR Super Admin
    const isGroupAdmin = group.admins.includes(req.user.id);
    const isSuperAdmin = req.user.role === 'super-admin';

    if (!isGroupAdmin && !isSuperAdmin) {
      return next(new AppError('Only admins can add users to this group', 403));
    }

    const { userId } = req.body;
    if (group.members.includes(userId)) {
      return next(new AppError('User is already a member', 400));
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: 'User added successfully', group });
  } catch (err) { next(err); }
};

// 3. REMOVE USER FROM GROUP (Admin only)
export const removeUserFromGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    // Same Admin/SuperAdmin check as above
    if (!group.admins.includes(req.user.id) && req.user.role !== 'super-admin') {
      return next(new AppError('Permission denied', 403));
    }

    group.members = group.members.filter(id => id.toString() !== req.body.userId);
    await group.save();

    res.status(200).json({ message: 'User removed' });
  } catch (err) { next(err); }
};
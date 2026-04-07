import Post from '../models/Post.js';
import Group from '../models/Group.js';
import AppError from '../utils/AppError.js';

// 1. CREATE POST (Supports Images + Groups)
export const createPost = async (req, res, next) => {
  try {
    const { title, content, groupId } = req.body;

    const postData = {
      title,
      content,
      author: req.user.id,
      group: groupId || null, // Global if no groupId provided
      images: req.body.images || [], // Populated by ImageKit middleware
    };

    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// 2. GET ALL POSTS (Global + Accessible Groups)
export const getAllPosts = async (req, res, next) => {
  try {
    // Find groups where the user is a member or admin
    const userGroups = await Group.find({
      $or: [{ members: req.user.id }, { admins: req.user.id }],
    }).select('_id');

    const groupIds = userGroups.map((g) => g._id);

    // Return ALL posts from: Global (null) OR groups user has access to
    const posts = await Post.find({
      $or: [{ group: null }, { group: { $in: groupIds } }],
    })
      .populate('author', 'username')
      .sort('-createdAt'); // Requirement: Sorted by createdAt

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// 3. GET USER POSTS (Requirement: Get specific user's posts)
export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username')
      .sort('-createdAt');
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// 4. UPDATE POST (Ownership Rules + Super Admin)
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return next(new AppError('Post not found', 404));

    // REQUIREMENT: Only post owner or Super Admin can edit
    const isOwner = post.author.toString() === req.user.id;
    const isSuperAdmin = req.user.role === 'super-admin';

    if (!isOwner && !isSuperAdmin) {
      return next(new AppError('You cannot update others\' posts', 403));
    }

    // Update with new data (including new images if uploaded)
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
};

// 5. DELETE POST (Ownership Rules + Super Admin)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(new AppError('Post not found', 404));

    // REQUIREMENT: Only post owner or Super Admin can delete
    const isOwner = post.author.toString() === req.user.id;
    const isSuperAdmin = req.user.role === 'super-admin';

    if (!isOwner && !isSuperAdmin) {
      return next(new AppError('You cannot delete others\' posts', 403));
    }

    await post.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};
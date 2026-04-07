import express from 'express';
import { createPost, getAllPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload, uploadOnImageKit } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllPosts)
  .post(
    protect, 
    upload.array('images', 5), // Step 1: Catch files from the form
    uploadOnImageKit,          // Step 2: Send to ImageKit
    createPost                 // Step 3: Save to MongoDB
  );

export default router;


import ImageKit from 'imagekit';
import multer from 'multer';
import AppError from '../utils/AppError.js';
import { IMAGEKIT_KEYS } from '../config/env.js';

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_KEYS.publicKey || "",
  privateKey: IMAGEKIT_KEYS.privateKey || "",
  urlEndpoint: IMAGEKIT_KEYS.urlEndpoint || ""
});

// 2. Configure Multer (Memory Storage)
const storage = multer.memoryStorage();

// Filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// 3. Custom Middleware: uploadOnImageKit
export const uploadOnImageKit = async (req, res, next) => {
  // If no files were uploaded, just move to the next middleware
  if (!req.files || req.files.length === 0) return next();

  try {
    const uploadPromises = req.files.map(file => {
      return imagekit.upload({
        file: file.buffer, // The file data from multer
        fileName: `post-${Date.now()}-${file.originalname}`,
        folder: '/blog-posts'
      });
    });

    // Wait for all images to upload
    const results = await Promise.all(uploadPromises);

    // Map the results to an array of URLs and attach to req.body
    req.body.images = results.map(img => img.url);
    
    next();
  } catch (err) {
    next(new AppError('Error uploading images to ImageKit', 500));
  }
};
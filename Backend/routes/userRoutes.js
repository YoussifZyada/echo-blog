import express from 'express';
import * as userCtrl from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); 

router.get('/', restrictTo('admin', 'super-admin'), userCtrl.getAllUsers);
router.get('/:id', userCtrl.getUserProfile);
router.patch('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

export default router;

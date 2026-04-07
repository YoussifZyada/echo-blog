import express from 'express';
import * as groupCtrl from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All group actions require login

router.post('/', groupCtrl.createGroup);
router.patch('/:id/add', groupCtrl.addUserToGroup);
router.patch('/:id/remove', groupCtrl.removeUserFromGroup);

export default router;


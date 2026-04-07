import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// The frontend calls /api/auth/signup, which triggers 'register'
router.post('/signup', register); // No parentheses!
router.post('/login', login);

export default router;
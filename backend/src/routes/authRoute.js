import express from 'express';
import { signUp, signIn, signOut, adminLogin, refreshToken, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/verify-email/:token',verifyEmail)
router.post('/signin', signIn);
router.post('/admin-login', adminLogin);
router.post('/signout', signOut);
router.post('/refresh-token', refreshToken);



export default router;
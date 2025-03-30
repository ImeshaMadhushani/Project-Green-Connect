import express from 'express';
import { authController, forgotPassword, getAllOrganizations, getOrganization, getOrganizationCount, login, resetPassword, updateOrganization, verifyOtp } from '../controllers/NGO/authController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();


router.post('/reg', authController);
router.post('/login', login);
router.get('/get', getOrganization);
router.get('/all', getAllOrganizations);
router.put('/update/:id', upload.fields([
    { name: 'profile_picture', maxCount: 1 }
]), updateOrganization)
router.get('/counts', getOrganizationCount);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);



export default router;
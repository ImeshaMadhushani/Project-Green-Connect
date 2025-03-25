import express from 'express';
import { authController, getAllOrganizations, getOrganization, login, updateOrganization } from '../controllers/NGO/authController.js';
import upload from '../config/multerConfig.js';

const router = express.Router();


router.post('/reg', authController);
router.post('/login', login);
router.get('/get', getOrganization);
router.get('/all', getAllOrganizations);
router.put('/update/:id', upload.fields([
    { name: 'profile_picture', maxCount: 1 }
]),updateOrganization)



export default router;
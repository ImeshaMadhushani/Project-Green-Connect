import express from 'express';
import { authController, login } from '../controllers/NGO/authController.js';

const router = express.Router();


router.post('/reg', authController);
router.post('/login', login);



export default router;
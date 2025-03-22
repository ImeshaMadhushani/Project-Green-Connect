import express from 'express';
import { authController } from '../controllers/NGO/authController.js';

const router = express.Router();


router.post('/login',authController);



export default router;
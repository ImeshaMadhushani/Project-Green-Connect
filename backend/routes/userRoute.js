import express from 'express';
import { approveOrganization, /* assignAdmin, */ deleteUser, getAllUsers, getUser, login, register, getCounts, forgotPassword, verifyOtp, resetPassword, logout, updateUser} from '../controllers/userController.js';
import upload from '../config/multerConfig.js';

const userRouter = express.Router();



userRouter.post('/register', upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    { name: 'legalDocument', maxCount: 1 }
]), register);

//userRouter.post('/register', register);
userRouter.post('/login', login)
userRouter.get('/getUser', getUser)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.put('/update/:id', upload.fields([
    { name: 'profile_picture', maxCount: 1 },
    /* { name: 'legalDocument', maxCount: 1 } */
]), updateUser)
userRouter.put('/approveOrganization/:userId', approveOrganization)
userRouter.delete('/delete/:userId', deleteUser)
//userRouter.put('/assignAdmin/:userId',assignAdmin)
userRouter.get('/counts', getCounts);

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

userRouter.post('/logout', logout);

export default userRouter;
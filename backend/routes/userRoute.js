import express from 'express';
import { approveOrganization, /* assignAdmin, */ deleteUser, getAllUsers, getUser, login, register, getCounts, forgotPassword, verifyOtp, resetPassword, logout, updateUser, suspendOrganization/* , getApproveOrganizations, *//*  getLegalDocument */} from '../controllers/userController.js';
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
   /*  { name: 'legalDocument', maxCount: 1 }  */
]), updateUser)
userRouter.put('/approveOrganization/:id', approveOrganization)
userRouter.put('/suspendOrganization/:id', suspendOrganization)
//userRouter.get('/legalDocument/:id', getLegalDocument);

userRouter.delete('/delete/:id', deleteUser)
//userRouter.put('/assignAdmin/:userId',assignAdmin)
userRouter.get('/counts', getCounts);

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/reset-password', resetPassword);

//userRouter.get('/allaprove/org', getApproveOrganizations);

userRouter.post('/logout', logout);

export default userRouter;
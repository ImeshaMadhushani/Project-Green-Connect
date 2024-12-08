import express from 'express';
import { approveOrganization, getAllUsers, getUser, login, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login)
userRouter.get('/getUser', getUser)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.put('/', approveOrganization)


export default userRouter;
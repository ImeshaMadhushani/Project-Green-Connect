import express from 'express';
import { getUser, login, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login)
userRouter.get('/getUser', getUser)


export default userRouter;
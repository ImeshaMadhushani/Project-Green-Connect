import express from 'express';
import { approveOrganization, assignAdmin, deleteUser, getAllUsers, getUser, login, register } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login)
userRouter.get('/getUser', getUser)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.put('/approveOrganization/:userId', approveOrganization)
userRouter.delete('delete/:id', deleteUser)
userRouter.put('/assignAdmin/:userId',assignAdmin)


export default userRouter;
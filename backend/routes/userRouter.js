import { Router } from 'express';
import { loginUser, registerUser, getMe } from '../controllers/user_controller.js';
import { protect } from '../middleware/auth.middleware.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/me', protect, getMe);

export default userRouter;

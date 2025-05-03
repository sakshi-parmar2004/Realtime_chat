import express from 'express'
import { checkAuth, login, logout, signup, update_Profile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const authRoutes = express.Router();

authRoutes.post('/signup',signup)
authRoutes.post('/login',login)
authRoutes.post('/logout',logout)

authRoutes.put('/update-profile', protectRoute, update_Profile)
authRoutes.get('/check',protectRoute,checkAuth)
export default authRoutes;
import express from "express";
import { registerWithCode } from "../controller/registrationController";
import { loginUser, logoutUser, forgotPassword, resetPassword } from "../controller/authController";
import { createAdminRegistrationCode, createUserRegistrationCode } from "../controller/registrationCodeController";
import { Request, Response, NextFunction } from "express";
import { authenticateUser, authorizeRoles } from '../middlewares/authMiddleware';

// Wrapper function to catch async errors
const asyncHandler = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

router.post("/admincode", authenticateUser,authorizeRoles("superadmin"), asyncHandler(createAdminRegistrationCode));
router.post("/usercode", authenticateUser,authorizeRoles("admin"), asyncHandler(createUserRegistrationCode));

router.post("/register", asyncHandler(registerWithCode));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', authenticateUser, asyncHandler(logoutUser));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));


export default router;

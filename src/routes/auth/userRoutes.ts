import express from "express";
import { registerWithCode } from "../../controller/auth/registrationController";
import { loginUser, logoutUser, forgotPassword, resetPassword } from "../../controller/auth/authController";
import { createRegistrationCode } from "../../controller/auth/registrationCodeController";
import { Request, Response, NextFunction } from "express";
import { authenticateUser, authorizeRoles } from '../../middlewares/authMiddleware';

// Wrapper function to catch async errors
const asyncHandler = (fn: any) => (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

router.post("/generatecode", authenticateUser,authorizeRoles("superadmin", "admin"), asyncHandler(createRegistrationCode));

router.post("/register", asyncHandler(registerWithCode));
router.post('/login', asyncHandler(loginUser));
router.post('/logout', authenticateUser, asyncHandler(logoutUser));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password', asyncHandler(resetPassword));


export default router;

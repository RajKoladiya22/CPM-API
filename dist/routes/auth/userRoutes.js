"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const registrationController_1 = require("../../controller/auth/registrationController");
const authController_1 = require("../../controller/auth/authController");
const registrationCodeController_1 = require("../../controller/auth/registrationCodeController");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
// Wrapper function to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};
const router = express_1.default.Router();
router.post("/generatecode", authMiddleware_1.authenticateUser, (0, authMiddleware_1.authorizeRoles)("superadmin", "admin"), asyncHandler(registrationCodeController_1.createRegistrationCode));
router.post("/register", asyncHandler(registrationController_1.registerWithCode));
router.post('/login', asyncHandler(authController_1.loginUser));
router.post('/logout', authMiddleware_1.authenticateUser, asyncHandler(authController_1.logoutUser));
router.post('/forgot-password', asyncHandler(authController_1.forgotPassword));
router.post('/reset-password', asyncHandler(authController_1.resetPassword));
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate JWT token
const generateToken = (userId, role, adminId) => {
    const payload = { userId, role, adminId }; // Payload contains user ID and role
    console.log(payload);
    const secretKey = process.env.JWT_SECRET_KEY || 'CPM@shivansh@123'; // JWT secret key
    const options = { expiresIn: '1h' }; // Token expires in 1 hour
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
};
exports.generateToken = generateToken;
// Verify JWT token
const verifyToken = (token) => {
    const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
    return jsonwebtoken_1.default.verify(token, secretKey);
};
exports.verifyToken = verifyToken;

import jwt, { SignOptions } from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId: string, role: string, adminId: string): string => {
  const payload = { userId, role, adminId }; // Payload contains user ID and role
  
  const secretKey = process.env.JWT_SECRET_KEY || 'CPM@shivansh@123'; // JWT secret key
  const options: SignOptions = { expiresIn: '12h' }; // Token expires in 12 hour

  return jwt.sign(payload, secretKey, options);
};

// Verify JWT token
export const verifyToken = (token: string) => {
  const secretKey = process.env.JWT_SECRET_KEY || 'your-secret-key';
  return jwt.verify(token, secretKey);
};

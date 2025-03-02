import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a manager
export const manager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Access denied, manager role required' });
  }
  next();
};
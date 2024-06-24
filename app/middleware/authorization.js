const jwt = require('jsonwebtoken');
const User = require("../model/users.model");

// Middleware untuk verifikasi token
function verifyToken (req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ message: 'Token is required' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token is invalid' });

        req.user = decoded;
        next();
    });
};

async function isAdmin(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({ message: 'Token is required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find user by ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if user is admin
      if (user.role_id !== 2) { // Adjust role_id for admin as per your system
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
  
      // Pass user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

module.exports = {
    verifyToken,
    isAdmin,
}
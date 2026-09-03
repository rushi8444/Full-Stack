export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Verify that req.user exists (set by auth.middleware.js)
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required',
      });
    }

    // Check if user's role is permitted[cite: 1]
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to perform this action',
      });
    }

    next();
  };
};
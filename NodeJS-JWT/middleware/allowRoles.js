module.exports = function authorizeRole(role) {
  return (req, res, next) => {
    console.log('User:', req.user); // Debug: Log the user object
    console.log('Expected Role:', role);
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};

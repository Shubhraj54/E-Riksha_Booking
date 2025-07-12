const { sendError } = require('../utils/response');

module.exports = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, 403, 'Access denied');
  }
  next();
}; 
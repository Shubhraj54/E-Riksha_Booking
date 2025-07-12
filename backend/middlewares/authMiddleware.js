const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendError } = require('../utils/response');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return sendError(res, 401, 'No token provided');
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 401, 'Invalid token');
  }
}; 
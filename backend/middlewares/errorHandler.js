const { sendError } = require('../utils/response');

module.exports = (err, req, res, next) => {
  console.error(err.stack);
  sendError(res, 500, process.env.NODE_ENV === 'development' ? err.message : 'Internal server error');
}; 
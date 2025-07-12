exports.sendResponse = (res, status = 200, data = null, message = null) => {
  return res.status(status).json({ success: true, data, message });
};

exports.sendError = (res, status = 500, error = 'Error') => {
  return res.status(status).json({ success: false, error });
}; 
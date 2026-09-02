/**
 * Standard API response format
 */

const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendError = (res, { statusCode = 500, message = 'Internal Server Error', errors = [] } = {}) => {
  const response = { success: false, message };
  if (errors.length > 0) response.errors = errors;
  return res.status(statusCode).json(response);
};

const sendPaginated = (res, { data, page, limit, total, message = 'Success' }) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };

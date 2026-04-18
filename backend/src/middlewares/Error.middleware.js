const errorHandler = (err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "Something went wrong";
  const errors = err.errors || null;

  const response = {
    success: false,
    message,
    errors,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statuscode).json(response);
};

export default errorHandler;

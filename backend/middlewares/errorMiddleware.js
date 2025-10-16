// Custom Error Handling Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // 🧩 Handle Mongoose bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found";
    statusCode = 404;
  }

  // 🧩 Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // 🧩 Handle duplicate key error (email, phone, etc.)
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    message = `Duplicate value for field: ${field}`;
    statusCode = 400;
  }

  // 🧩 Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token, please log in again";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Your token has expired, please log in again";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler, notFound };

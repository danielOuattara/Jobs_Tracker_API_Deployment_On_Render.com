//mdn Object.keys
//-----------------------------------------------------------------------

/* 
In this function we create a FINAL error object called customError.
We populate properties of this error object according to the error origin:

- our custom error (from controllers logic)
- mongoose/mongodb validation/cast/duplicate error ( resolved here)
- other errors (from anywhere else)
*/

const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  //
  /* --> set default */
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something wrong, try again later",
  };
  //
  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(" ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
    //
  } else if (err.code && err.code === 11000) {
    customError.message = `Duplicate ${Object.keys(err.keyValue)[0]}: ${
      Object.values(err.keyValue)[0]
    } Please, choose another one !`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
    //
  } else if (err.name === "CastError") {
    customError.message = `No item using Id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });

  return res
    .status(customError.statusCode)
    .json({ message: customError.message });
};

module.exports = errorHandlerMiddleware;

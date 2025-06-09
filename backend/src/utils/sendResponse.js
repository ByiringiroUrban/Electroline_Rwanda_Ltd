const sendResponse = (res, statusCode, success, dataOrMessage) => {
  res.status(statusCode).json({
    success,
    ...(success ? { data: dataOrMessage } : { message: dataOrMessage }),
  });
};

export default sendResponse;

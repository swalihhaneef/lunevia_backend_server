import { asyncErrorHandler, Error } from "express-error-catcher";

import jwt from "jsonwebtoken";

const auth = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.tkn;

  if (isNull(token)) throw new Error("Authentication failed", 401);

  const data = jwt.verify(token, process.env.TOKEN_SECRET);

  req.user = { _id: data.id, ...data };

  next();
});

export default auth;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.SECRET;

export const createToken = (user) => {
  const token = jwt.sign({ _id: user._id, email: user.email }, secret);
  return token;
};

export const validateToken = (req, res, next) => {
  const token = req.cookies["token"];
  if (!token) return res.status(400).json("Login in order to continue");

  try {
    const validToken = jwt.verify(token, secret);

    if (validToken) {
      req["authenticated"] = true;
      req["jwtPayload"] = jwt.decode(token);
      return next();
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

//if for some reason you decide to need authorization -- add roles to database

export const authorizeToken = (req, res, next) => {
  const { jwtPayload } = req;
  try {
    return next();
  } catch (err) {
    res.status(400).json(err);
  }
};

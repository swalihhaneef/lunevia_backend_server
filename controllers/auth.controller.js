import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import model from "../model/index.js";
import jwt from "jsonwebtoken";

export const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  // temp email - admin@lunevia.com
  // temp pass - admin@124

  const user = await model.User.findOne({ email });

  if (!user) throw new Error("Invalid email or password", 400);

  const isValid = user.validatePassword(password, user.password);

  if (!isValid) throw new Error("Invalid email or password", 400);

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  const accessTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  res.cookie("tkn", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: accessTokenMaxAge,
  });

  return new Response(
    null,
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    200
  );
});

export const logoutUser = asyncErrorHandler(async (req, res) => {
  try {
    res.clearCookie("tkn", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return new Response("Logout successful", null, 200);
  } catch (error) {
    console.error(error.message);
    throw new Error("Unable to logout, please try again later", 400);
  }
});

// import bcrypt  from 'bcryptjs'
// const registerUser = async (user) => {
//   const { name, email, password } = user;

//   const existingUser = await model.User.findOne({ email });

//   if (existingUser) throw new Error("User already exists", 400);

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newUser = await model.User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   console.log('user has created', newUser)
// }

// registerUser({name:'admin',email:'admin@lunevia.com',password:'admin@124'})
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../jwt.js";

export const createUser = async (req, res) => {
  try {
    const payload = req.body;
    const user = new User(payload);
    await user.validate();
    await user.save();
    const token = createToken(user);
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      })
      .send(user);
  } catch (err) {
    res.json(err);
  }
};

export const loginAsUser = async (req, res) => {
  const payload = req.body;

  try {
    const user = await User.findOne({ email: payload.email });
    if (!user) return res.status(400).json("Provided Email does not exist");

    const passwordMatch = await bcrypt.compare(payload.password, user.password);
    if (!passwordMatch) return res.status(400).json("Password is incorrect");

    const token = createToken(user);
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      })
      .json(`successfully logged in, Hello ${user.firstName}`);
  } catch (err) {
    res.json({ err, payload });
  }
};

export const getUser = async (req, res) => {
  try {
    const { jwtPayload } = req;
    const user = await User.findOne({ _id: jwtPayload._id });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

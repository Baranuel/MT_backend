import mongoose from "mongoose";
import bcrypt from "bcrypt";

const user_schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "what is your first name?"],
    maxLength: [25, "Name can not be longer than 25 characters"],
  },
  lastName: {
    type: String,
    required: [true, "what is your last name?"],
    maxLength: [25, "Name can not be longer than 25 characters"],
  },
  email: {
    type: String,
    required: [true, "email field is required"],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Needs to be at least 6 characters"],
  },
});

user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

const User = mongoose.model("User", user_schema, "Users");

export default User;

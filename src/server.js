import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
  createUser,
  loginAsUser,
  getUser,
} from "./Controllers/User_Controller.js";
import User from "./Models/User.js";
import cookieParser from "cookie-parser";
import { validateToken, authorizeToken } from "./jwt.js";

const app = express();
//config
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT;
const pwd = process.env.URI_PWD;
const uri = `mongodb+srv://Baranuel:${pwd}@atlas-test-1.evjmgui.mongodb.net/Mood_Tracker`;

//open a connection with db
mongoose.connect(uri);

app.get("/profile", validateToken, authorizeToken, getUser);

app.post("/auth/login", loginAsUser);
app.post("/auth/signup", createUser);

app.listen(port, () => {
  console.log("the server is running");
});

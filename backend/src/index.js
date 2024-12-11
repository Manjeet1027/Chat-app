// const express = require("express");
import express from "express";    // package -> type : module
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.route.js"

import {connectDB} from "./lib/db.js"

const app = express();
const PORT = process.env.PORT;

app.use(express.json());  // help in extracting the json data out of body in auth.controller.js

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is runing on port:" + PORT);
  connectDB();
});
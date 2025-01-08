// const express = require("express");
import express from "express";    // package -> type : module
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./lib/db.js"
import {app, server} from "./lib/socket.js"

import path from "path"

// const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// use->middleware    
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json());  // help in extracting the json data out of body in auth.controller.js
app.use(cookieParser());  // help to parse the cookie

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// app.listen(PORT, () => {
server.listen(PORT, () => {
  console.log("Server is runing on port:" + PORT);
  connectDB();
});

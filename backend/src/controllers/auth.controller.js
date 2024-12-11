import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req,res) => {
  const {fullName, email, password} = req.body;  // info that we will get

  try{
    if(!fullName || !email || !password){
      return res.status(400).json({message : "All fields are required"});
    }
    if(password.length < 6){
      return res.status(400).json({message : "Password must be atleast of 6 letters"});
    }

    const user = await User.findOne({email});

    if(user) return res.status(400).json({message : "User already exist"});  // if already exist

    const salt = await bcrypt.genSalt(10); //part of hased password
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({    // creating new user
      fullName,
      email,
      password: hashPass
    })

    if(newUser){
        // genrate token for user
        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic
        })
    }
    else{
      res.status(400).json({message: "Invalid user data"});
    }
  }

  catch(err){
    console.log("Error in signup", err.message)
    res.status(500).json({ message: "Internal Server Error"});
  }
};

export const login = (req,res) => {
  res.send("login route");
};

export const logout = (req,res) => {
  res.send("logout route");
};
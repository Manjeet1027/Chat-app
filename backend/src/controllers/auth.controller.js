import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"

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
 
export const login = async (req,res) => {
  const {email, password} = req.body;

  try{
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({message:"Invalid credentials"});
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if(!isPassCorrect){
      return res.status(400).json({message:"Invalid Credentials"});
    }
  

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  }
  catch(err){
    console.log("Error in login", err.message);
    res.status(500).json({Message:"Internal Server Error"});
  }
};

export const logout = async (req,res) => {
  try{
    res.cookie("jwt","",{maxAge: 0});
    res.status(200).json({message:"Logged out succcessfully"});
  }
  catch(err){
    console.log("Error in logout", err.message);
    res.status(500).json({Message:"Internal Server Error"});
  }
};

export const updateProfile = async(req, res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;  // user added to req in protected route 

    if(!profilePic){
      return res.status(400).json({message:"Profile Pic is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);   // cloudinary is not our DB it is just a bucket to store the profile pictures
    const updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url},{new: true});

    res.status(200).json(updateUser);

  }
  catch(err){
    console.log("Error in update profile", err);
    res.status(500).json({message:"Internal Server Error"})
  }
}


export const checkAuth = (req, res) => {
  try{
    res.status(200).json(req.user);
  }
  catch(err){
    console.log("Error in checkAuth", err.message);
    res.status(500).json({message:"Internal Server Error"});
  }
}


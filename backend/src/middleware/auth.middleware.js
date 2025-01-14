import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next) => {
  try{
    const token = req.cookies.jwt;    // ""jwt" name given to cookie in utils

    if(!token){
      console.log("Error with the token")
      return res.status(401).json({message:"Unauthorized - No token Provided"});
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decoded){
      console.log("Error with the token")
      return res.status(401).json({message:"Unauthorized - Invalid token"});
    }

    const user = await User.findById(decoded.userId).select("-password");   // give everything except password

    if(!user){    // might never get called but just to be on safer side
      return res.status(404).json({message:"User not found"});
    }

    req.user = user;

    next();
  }
  catch(err){
    console.log("Error in middleware", err.message);
    return res.status(500).json({message:"Interal Server Error"})
  }
}

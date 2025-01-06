import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn:"2d"
  })

  res.cookie("jwt", token,{
    maxAge: 2*24*60*60*1000,//millisec,  
    httpOnly: true, // prevents from attacks
    sameSite: "strict",
    secure: process.env.NODE_ENV !=="development" // so in development phase it will be false;
    });

    return token;
}
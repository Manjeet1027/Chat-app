import User from "../models/user.model.js";
import Message from "../models/message.model.js"

import cloudinary from "../lib/cloudinary.js"

export const getUsersForSidebar = async (req, res) =>{
  try{
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id : {$ne: loggedInUserId}}).select("-password"); // collect all the users credential except the password and the one which is Logged In
  }
  catch(err){
    console.log("Error in getUsersForSidebar: ", err.message);
    res.status(500).json({error: "Internal Server Error"})
  }
}

export const getMessages = async(req,res) => {
  try{
    const {id:userToChatId} = req.params; // used id as mentioned in route and renamed to userToChatId
    const myId = req.user._id;

    const messages = await Message.find({
      $or:[
        {senderId: myId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: myId}
      ]
    })

    res.status(200).json(messages);

  }
  catch(err){
    console.log("Error in getMessages: ", err.message);
    res.status(500).json({error: "Internal Server Error"})
  }
}

export const sendMessage = async(req, res) => {
  try{
    const {text, image} = req.body;
    const {id : receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })

    await newMessage.save();

    // todo : realtime functionality using socket.io

    res.status(201).json(newMessage);
  }
  catch(err){
    console.log("Error in sendMessage: ", err.message);
    res.status(500).json({error: "Internal Server Error"})
    res.status(500).json({error:"Internal Server Error"})
  }
}

import cloudinary from "../config/cloudinary.js";
import { getRecieverSocketId, io } from "../config/socket.js";
import Message from "../models/messsage.model.js";
import User from "../models/UserSchema.js";

export const getUsersData = async(req,res)=>
{
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({_id: { $ne:loggedUserId }}).select("-password");
        res.status(201).json(filteredUsers)
        
    } catch (error) { 
        console.log(error.message);
         res.status(500).json({ success: false, message: error.message });
    }
  
}

export const getMessages = async (req,res) => {
    try {

        const {id:receiverId} = req.params;
        const myId = req.user._id;
    
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:receiverId },
                {senderId: receiverId , receiverId:myId }
            ]
        })
        res.status(201).json(messages)
        
    } catch (error) {
        console.log( "Error is getMessages controller",error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const sendMessages = async(req, res)=>
{
    try {
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        const {text,image} = req.body;
        let imageURL ;
        if(image)
        {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageURL= uploadResponse.secure_url;
        }
        const newMessage = new Message(
            {
                senderId,
                receiverId,
                text,
                image:imageURL
            }
        )
        await newMessage.save();
        
//using socket io
const recieverSocketId =getRecieverSocketId(receiverId);
        if(recieverSocketId)
        {
           io.to(recieverSocketId).emit("getMessage", newMessage)
        }
        //using socket io
 res.status(201).json(newMessage)

    } catch (error) {
        console.log( "Error is sendMessages controller",error.message);
        res.status(500).json({ success: false, message: error.message });

        
    }
   

}
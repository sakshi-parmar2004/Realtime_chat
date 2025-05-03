import User from "../models/UserSchema.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/utils.js";
import cloudinary from "../config/cloudinary.js";

 
export const signup = async(req,res) => {


    const {name,email, password} = req.body;
  try {
     
    if(!email || !name || !password)
    {
        return res.json({success:false, message:"All credentials required"})
    }
    const Exist = await User.findOne({email:email})
    if(Exist)
    {
        res.json({success:false,message:"User already exists"});
    
    }
    if(password.length<6)
      {
       return res.json({success:false,message:"Password length is less than 6"});
      }
   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const newUser=  new User({email,name,password:hashedPassword});
    if(newUser)
    {
        //generate token for the user
        generateToken(newUser._id, res);
        await newUser.save();
        res.status(200).json({_id:newUser._id,
          name:newUser.name,
          email:newUser.email,
          profile_pic:newUser.profile_pic
        })

        res.json({success:true,message:"User created succesfully"});
    }
    else{
      res.json({success:false, message:"Invalid user data"})
    }
  

    
  } catch (error) {
    console.log(error.message);
    res.json({success:false, message:"Signup failed"})
  }


};
export const login = async(req,res) => {
  const {email, password} = req.body;
  try {
    
    if(!email || !password)
      {
          return res.json({success:false, message:"All credentials required"})
      }

      const UserExist = await User.findOne({email:email})
    if(!UserExist)
    {
        return res.json({success:false,message:"User doesn't exists"});
    
    }
    const isValidPassword = await bcrypt.compare(password, UserExist.password);

    if(!isValidPassword)
    {
      return res.json({success:false, message:"Wrong password"})
    }
    generateToken(UserExist._id , res)
    res.json({
      _id:UserExist._id,
          name:UserExist.name,
          email:UserExist.email,
          profile_pic:UserExist.profile_pic
    })


  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.mesasage
    })
  }


};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // clear cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const update_Profile = async(req,res)=>
{
  try {
     
    const {profile_pic} = req.body;
    // console.log("profile pic",profile_pic);
    const userId = req.user._id;
    if(!profile_pic)
    {
      res.status(500).json({ success: false, message: "profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profile_pic)
    const updateuser = await User.findByIdAndUpdate(userId,{profile_pic:uploadResponse.secure_url},{new:true})

   res.status(201).json(updateuser)
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const checkAuth =(req,res)=>
{
  try {
    res.json(req.user)
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}
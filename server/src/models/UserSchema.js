
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Correctly placed timestamps option
  }
);

const User = mongoose.model('User', UserSchema);
export default User;
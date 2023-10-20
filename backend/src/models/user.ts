import mongoose from "mongoose";

const schema = mongoose.Schema;
//schema
const userSchema = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },

    isDeactivated: {
      type: Boolean,
      default: false,
    },
    RemainingTry: {
      type: Number,
      default: 4,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
//model

export default User;

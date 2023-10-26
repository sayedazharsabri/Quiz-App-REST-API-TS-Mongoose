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
      default: 3,
    },
    temperoryKey: {
      type:String,
      default: ''
    },
    FreezeTime: {
      type: Date,
      default: new Date()
    },
    accountblocked: {
      type: Boolean,
      default: false
    },
    istempkeyused: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

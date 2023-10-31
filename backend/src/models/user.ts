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
    temperoryKey: {  //Helped to generate a temperory key to validate account and have an extra login attempt
      type:String,
      default: ''
    },
    FreezeTime: { //It is used to calculate the remaining try if account is blocked due to maximum invalid tries
      type: Date,
      default: new Date()
    },
    accountblocked: { //It shows whether the account is blocked or not
      type: Boolean,
      default: false
    },
    istempkeyused: { //It shows whether the temperory key is used or not
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;

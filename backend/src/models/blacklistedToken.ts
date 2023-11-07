import mongoose from "mongoose";

const schema = mongoose.Schema;

const blacklistSchema = new schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiryAt: {
            type: Number,
            required: true
        },
    },
);

const Blacklist = mongoose.model("Blacklisted Token", blacklistSchema);

export default Blacklist;




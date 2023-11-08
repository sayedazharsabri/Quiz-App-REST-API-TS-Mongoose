import mongoose from "mongoose";

const schema = mongoose.Schema;

const blacklistedTokenSchema = new schema(
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

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);

export default BlacklistedToken;




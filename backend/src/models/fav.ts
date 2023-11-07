import mongoose, { mongo } from "mongoose";

const schema = mongoose.Schema;
//schema
const favSchema = new schema(
    {
        userId:{
            type:mongoose.Types.ObjectId
        },
        question: {
            type: String,
            required:true
        },
        options:{}
    },
);

const Fav = mongoose.model("FavouriteQuestion", favSchema);

export default Fav;
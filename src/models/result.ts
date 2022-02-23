import mongoose from 'mongoose';
const schema = mongoose.Schema;

const resultSchema = new schema(
    {
        userId:{
            type:mongoose.Types.ObjectId,
            required:true
        },
        quizId:{
            type:mongoose.Types.ObjectId,
            required:true,
        },
        score:{
            type:Number,
            required:true
        },
        total:{
            type:Number,
            required:true
        }
    },
    {timestamps:true}
);



const Result = mongoose.model("Result",resultSchema);
//model

export default Result;
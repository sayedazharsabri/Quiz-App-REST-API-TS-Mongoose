import mongoose from "mongoose";

const schema = mongoose.Schema;
//schema
const quizSchema = new schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questionList: [
      {
        questionNumber: Number,
        question: String,
        options: {},
      },
    ],
    answers: {},
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    passingPercentage:{
      type: Number,
      required: true
    },
    isPublicQuiz: {
      type: Boolean,
      required: true
    },
    allowedUser: {
      type: [],
      default: []
    }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

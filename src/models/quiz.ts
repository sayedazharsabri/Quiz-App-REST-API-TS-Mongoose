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
    questions_list: [
      {
        question_number: Number,
        question: String,
        options: {},
      },
    ],
    answers: {},
    created_by: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    is_published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

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
    category: {
      type: String,
      required: true
    },
    difficultyLevel: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    questionList: [
      {
        questionNumber: Number,
        question: String,
        options: {},
      },
    ],
    answers: {},
    passingPercentage: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    
    isPublicQuiz: {
      type: Boolean,
      required: true
    },
    allowedUser: {
      type: [],
      default: []
    },
    attemptsAllowedPerUser: {   //how many times quiz can be attempted by user
      type: Number              //required is false, if not provided quiz can be attempted multiple times
    },
    attemptedUsers: [        //Stores an array of objects users who have attempted the quiz
      {                      //and number of attempts left
        id: String,
        attemptsLeft: Number
      }
    ]
    
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

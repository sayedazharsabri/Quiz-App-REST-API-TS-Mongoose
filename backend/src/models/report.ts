import mongoose from "mongoose";
const schema = mongoose.Schema;

const reportSchema = new schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
//model

export default Report;

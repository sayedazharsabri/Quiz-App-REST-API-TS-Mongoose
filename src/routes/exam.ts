import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middlewares/isAuth";
import { doesQuizExist, startExam, submitExam } from "../controllers/exam";
import { body } from "express-validator";

// GET /exam/quizId
router.get("/:quizId", isAuthenticated, startExam);

// POST /exam
router.post("/",
[
    body("quizId")
    .trim()
    .not()
    .isEmpty()
    .custom((quizId)=>{
        return doesQuizExist(quizId)
        .then((status:Boolean)=>{
            if(!status){
                return Promise.reject("Please provide a valid quiz id.");
            }
        })
        .catch((err)=>{
            return Promise.reject(err);
        })
    }),
    body("attempted_question")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Invalid attempt!")
], isAuthenticated, submitExam);

export default router;

import express from "express";
import { body } from "express-validator";

import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  isValidQuiz,
  isValidQuizName,
  publishQuiz,
  updateQuiz,
  getAllQuiz,
  getAllQuizExam,
  getAllQuizTest
} from "../controllers/quiz";
import { validateRequest } from "../helper/validateRequest";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();

// create
// POST /quiz/
router.post(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid name, minimum 10 character long")
      .custom((name) => {
        return isValidQuizName(name)
          .then((status: Boolean) => {
            if (!status) {
              return Promise.reject("Plaase enter an unique quiz name.");
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }),
    body("category")
      .trim()
      .not()
      .isEmpty()
      .toLowerCase()
      .isIn(['test', 'exam'])
      .withMessage("category can only be 'test' or 'exam'"),
    body("questionList").custom((questionList, { req }) => {
      return isValidQuiz(questionList, req.body["answers"])
        .then((status: Boolean) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz having atleast one question, and answers with correct options!"
            );
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
    body("passingPercentage").custom((passingPercentage:Number)=>{
      if(passingPercentage==0){
        return Promise.reject("Passing percentage can not be zero..");
      }
      return true;
    }),
    body("difficultyLevel").custom((difficultyLevel) => {
      if (!difficultyLevel || !["easy", "medium", "hard"].includes(difficultyLevel)) {
        return Promise.reject("Difficulty level must be easy, medium and hard");
      }
      return true;
    }),
  ],
  validateRequest,
  createQuiz
);

//Get  quiz/allpublished quiz
router.get("/allpublishedquiz",isAuthenticated, getAllQuiz);

//Get  quiz/allpublished quiz/exam
router.get("/allpublishedquiz/exam",isAuthenticated, getAllQuizExam);

//Get  quiz/allpublished quiz/test
router.get("/allpublishedquiz/test",isAuthenticated, getAllQuizTest);

// get
// GET /quiz/:quizId
router.get("/:quizId?", isAuthenticated, getQuiz);

//

//update
//PUT /quiz
router.put(
  "/",
  isAuthenticated,
  [
    body("name")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 10 })
      .withMessage("Please enter a valid name, minimum 10 character long"),
    body("questionList").custom((questionList, { req }) => {
      return isValidQuiz(questionList, req.body["answers"])
        .then((status: Boolean) => {
          if (!status) {
            return Promise.reject(
              "Please enter a valid quiz having atleast one question, and answers with correct option!"
            );
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }),
    body("passingPercentage").custom((passingPercentage:Number)=>{
      if(passingPercentage==0){
        return Promise.reject("Passing percentage can not be zero..");
      }
      return true;
    }),
    body("difficultyLevel").custom((difficultyLevel) => {
      if (!difficultyLevel || !["easy", "medium", "hard"].includes(difficultyLevel)) {
        return Promise.reject("Difficulty level must be easy, medium and hard");
      }
      return true;
    }),
  ],
  validateRequest,
  updateQuiz
);

//Delete
//DELETE quiz/:quizId
router.delete("/:quizId", isAuthenticated, deleteQuiz);

//Publish
// PATCH quiz/publish
router.patch("/publish", isAuthenticated, publishQuiz);

export default router;

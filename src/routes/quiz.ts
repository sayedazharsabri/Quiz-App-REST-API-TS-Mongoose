import express from "express";
import {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  isValidQuiz,
} from "../controllers/quiz";
import { isAuthenticated } from "../middlewares/isAuth";

import { body } from "express-validator";

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
      .withMessage("Please enter a valid name, minimum 10 character long"),
    body("questions_list").custom((questions_list: [], { req }) => {
      return isValidQuiz(questions_list, req.body["answers"])
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
  ],
  createQuiz
);

// get
// GET /quiz/:quizId
router.get("/:quizId", isAuthenticated, getQuiz);

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
    body("questions_list").custom((questions_list) => {
      if (questions_list.length == 0) {
        return Promise.reject("Enter atleast 1 question!");
      }
      return true;
    }),
    body("answers").custom((answers) => {
      if (Object.keys(answers).length == 0) {
        return Promise.reject("Answer should not be empty!");
      }
      return true;
    }),
  ],
  updateQuiz
);

//Delete
//DELETE quiz/:quizId
router.delete("/:quizId", isAuthenticated, deleteQuiz);

//Publish
// PATCH quiz/publish
router.patch("/publish", isAuthenticated, publishQuiz);

export default router;

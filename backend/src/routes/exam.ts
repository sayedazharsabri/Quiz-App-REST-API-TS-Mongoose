import express from "express";
import { body } from "express-validator";

import {
  doesQuizExist,
  isValidAttempt,
  startExam,
  submitExam,
} from "../controllers/exam";
import { validateRequest } from "../helper/validateRequest";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();
// GET /exam/quizId
router.get("/:quizId", isAuthenticated, startExam);

// POST /exam
router.post(
  "/",
  isAuthenticated,
  [
    body("quizId")
      .trim()
      .not()
      .isEmpty()
      .custom((quizId) => {
        return doesQuizExist(quizId)
          .then((status: Boolean) => {
            if (!status) {
              return Promise.reject("Please provide a valid quiz id.");
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }),
    body("attemptedQuestion")
      .not()
      .isEmpty()
      .custom((attemptedQuestion, { req }) => {
        return isValidAttempt(attemptedQuestion, req.body.quizId)
          .then((status: Boolean) => {
            if (!status) {
              return Promise.reject();
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      })
      .withMessage("Invalid attempt!"),
  ],
  validateRequest,
  submitExam
);

export default router;

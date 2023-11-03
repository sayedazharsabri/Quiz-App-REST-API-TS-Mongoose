import { RequestHandler } from "express";
import { Mongoose } from "mongoose";

import ProjectError from "../helper/error";
import Quiz from "../models/quiz";
import Report from "../models/report";
import { ReturnResponse } from "../utils/interfaces";

const startExam: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      category: 1,
      questionList: 1,
      isPublished: 1,
      attemptedUsers: 1,
      attemptsAllowedPerUser: 1
    });

    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    if (!quiz.isPublished) {
      const err = new ProjectError("Quiz is not published!");
      err.statusCode = 405;
      throw err;
    }

    if (quiz.category === "test") {

      if (quiz.attemptsAllowedPerUser !== undefined) {

        if (quiz.attemptedUsers.some(obj => obj.id!.toString() === req.userId.toString())) {
          const checkUser = quiz.attemptedUsers.find(obj => obj.id!.toString() === req.userId.toString());
          if (checkUser) {
            if (checkUser.attemptsLeft! > 0) {
              checkUser.attemptsLeft! -= 1;
              const updated = await quiz.save();
            }
            else {
              const err = new ProjectError("You have zero attempts left!");
              err.statusCode = 405;
              throw err;
            }
          }
        }
        else {
          const newUser = { id: req.userId!.toString(), attemptsLeft: quiz.attemptsAllowedPerUser! - 1 };
          quiz.attemptedUsers.push(newUser);
          const updated = await quiz.save();
        }
      }
    }

    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz",
      data: quiz,
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const submitExam: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.body.quizId;
    const attemptedQuestion = req.body.attemptedQuestion;

    const quiz = await Quiz.findById(quizId, { answers: 1, passingPercentage: 1 });
    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }
    const answers = quiz.answers;
    const passingPercentage = quiz.passingPercentage;

    const userId = req.userId;
    const allQuestions = Object.keys(answers);
    const total = allQuestions.length;

    let score = 0;

    for (let i = 0; i < total; i++) {
      let questionNumber = allQuestions[i];
      if (
        !!attemptedQuestion[questionNumber] &&
        answers[questionNumber] == attemptedQuestion[questionNumber]
      ) {
        score = score + 1;
      }
    }

    let result = "";
    let percentage = 0;
    percentage = score / total * 100;

    if (percentage >= passingPercentage) {
      result += "Pass";
    }
    else {
      result += "Fail";
    }

    const report = new Report({ userId, quizId, score, total, percentage, result });
    const data = await report.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz submitted",
      data: { total, score, result, reportId: data._id },
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const doesQuizExist = async (quizId: Mongoose["Types"]["ObjectId"]) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return false;
  return true;
};

const isValidAttempt = async (
  attemptedQuestion: {},
  quizId: Mongoose["Types"]["ObjectId"]
) => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    const err = new ProjectError("No quiz found!");
    err.statusCode = 404;
    throw err;
  }
  const answers = quiz.answers;
  const questions = Object.keys(answers);
  const attemptQ = Object.keys(attemptedQuestion);
  if (attemptQ.length != questions.length) return false;

  let flag = 0;
  attemptQ.forEach((e) => {
    if (questions.indexOf(e) < 0) {
      flag = 1;
    }
  });
  if (flag) {
    return false;
  }
  return true;
};

export { doesQuizExist, isValidAttempt, startExam, submitExam };

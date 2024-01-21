import { RequestHandler } from "express";
import { Mongoose } from "mongoose";

import ProjectError from "../helper/error";
import Quiz from "../models/quiz";
import Report from "../models/report";
import { ReturnResponse } from "../utils/interfaces";

const startExam: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questionList: 1,
      isPublished: 1,
      createdBy: 1,
      category: 1,
      attemptsAllowedPerUser: 1,
      attemptedUsers: 1,
      passingPercentage:1,
      isPublicQuiz:1,
      allowedUser:1
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
    if (quiz.createdBy.toString() === userId) {
      const err = new ProjectError("You can't attend your own quiz!");
      err.statusCode = 405;
    }
    if(!quiz.isPublicQuiz && !quiz.allowedUser.includes(req.userId)){
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }
    if (quiz.category === "test") {
      if (quiz.attemptsAllowedPerUser) {

        if (quiz.attemptedUsers.length) {
          quiz.attemptedUsers.forEach((user) => {
            const id = user.id;
            if (id === req.userId) {
              if (user.attemptsLeft !== undefined) {
                if (user.attemptsLeft > 0) {
                  user.attemptsLeft -= 1;
                }
                else {
                  const err = new ProjectError("You have zero attempts left!");
                  err.statusCode = 405;
                  throw err;
                }
              }
            }
          })
          const updated = await quiz.save();
        }
        else {

          if (req.userId && quiz.attemptsAllowedPerUser) {
            const newUser = { id: req.userId.toString(), attemptsLeft: quiz.attemptsAllowedPerUser - 1 };
            quiz.attemptedUsers.push(newUser);
            const updated = await quiz.save();
          }
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
    const userId = req.userId;
    const quizId = req.body.quizId;
    const attemptedQuestion = req.body.attemptedQuestion;
    
    const quiz = await Quiz.findById(quizId, { questionList: 1 ,answers: 1, passingPercentage:1 });
    if (!quiz) {
      const err = new ProjectError("No quiz found!");
      err.statusCode = 404;
      throw err;
    }

    if (quiz.createdBy.toString() === userId) {
      const err = new ProjectError("You can't submit your own quiz!");
      err.statusCode = 405;
      throw err;
    }
    const answers = quiz.answers;
    const passingPercentage = quiz.passingPercentage;
    const allQuestions = Object.keys(answers);
    const total = allQuestions.length;

    let score = 0;
    let attemptedAnswerWithRightAnswer = [];

    for (let i = 0; i < total; i++) {
      let questionNumber = allQuestions[i];
      const attemptedAnswer = attemptedQuestion[questionNumber];
      const rightAnswer = answers[questionNumber];
      if(!!attemptedAnswer){
        attemptedAnswerWithRightAnswer.push({
          questionNumber,
          attemptedAnswer,
          rightAnswer
        })
      }

      if (
        !!attemptedQuestion[questionNumber] &&
        answers[questionNumber] == attemptedQuestion[questionNumber]
      ) {
        score = score + 1;
      }
    }

    let result = "";
    let percentage = 0;
    percentage = (score / total) * 100;

    if (percentage >= passingPercentage) {
      result += "Pass";
    } else {
      result += "Fail";
    }

    const report = new Report({
      userId,
      quizId,
      score,
      total,
      percentage,
      result,
      attemtedAnswers: attemptedAnswerWithRightAnswer
    });
    const data = await report.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz submitted",
      data: { total, score,result, reportId: data._id, attemptedAnswerWithRightAnswer} 
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

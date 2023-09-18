//model
import { RequestHandler } from "express";

import Quiz from "../models/quiz";
import ProjectError from "../helper/error";
import { ReturnResponse } from "../utils/interfaces";

const createQuiz: RequestHandler = async (req, res, next) => {
  try {

    const created_by = req.userId;
    const name = req.body.name;
    const questions_list = req.body.questions_list;
    const answers = req.body.answers;

    const quiz = new Quiz({ name, questions_list, answers, created_by });
    const result = await quiz.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz created successfully",
      data: { quizId: result._id },
    };
    res.status(201).send(resp);
  } catch (error) {
    next(error);
  }
};

const getQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, {
      name: 1,
      questions_list: 1,
      answers: 1,
      created_by: 1,
    });

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req.userId !== quiz.created_by.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
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

const updateQuiz: RequestHandler = async (req, res, next) => {
  try {

    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req.userId !== quiz.created_by.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (quiz.is_published) {
      const err = new ProjectError("You cannot update, published Quiz!");
      err.statusCode = 405;
      throw err;
    }
    if (quiz.name != req.body.name) {
      let status = await isValidQuizName(req.body.name);
      if (!status) {
        const err = new ProjectError("Please enter an unique quiz name.");
        err.statusCode = 422;
        throw err;
      }
      quiz.name = req.body.name;
    }
    quiz.questions_list = req.body.questions_list;
    quiz.answers = req.body.answers;

    await quiz.save();

    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz updated successfully",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const deleteQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req.userId !== quiz.created_by.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (quiz.is_published) {
      const err = new ProjectError("You cannot delete, published Quiz!");
      err.statusCode = 405;
      throw err;
    }

    await Quiz.deleteOne({ _id: quizId });
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz deleted successfully",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const publishQuiz: RequestHandler = async (req, res, next) => {
  try {
    const quizId = req.body.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const err = new ProjectError("Quiz not found!");
      err.statusCode = 404;
      throw err;
    }

    if (req.userId !== quiz.created_by.toString()) {
      const err = new ProjectError("You are not authorized!");
      err.statusCode = 403;
      throw err;
    }

    if (!!quiz.is_published) {
      const err = new ProjectError("Quiz is already published!");
      err.statusCode = 405;
      throw err;
    }

    quiz.is_published = true;
    await quiz.save();
    const resp: ReturnResponse = {
      status: "success",
      message: "Quiz published!",
      data: {},
    };
    res.status(200).send(resp);
  } catch (error) {
    next(error);
  }
};

const isValidQuiz = async (
  questions_list: [{ question_number: Number; question: String; options: {} }],
  answers: {}
) => {
  if (!questions_list.length) {
    return false;
  }
  if (questions_list.length != Object.keys(answers).length) {
    return false;
  }
  let flag = true;
  questions_list.forEach(
    (question: { question_number: Number; question: String; options: {} }) => {
      let opt = Object.keys(question["options"]);
      if (
        opt.indexOf(
          `${
            Object.values(answers)[
              Object.keys(answers).indexOf(question.question_number.toString())
            ]
          }`
        ) == -1
      ) {
        flag = false;
      }
    }
  );
  return flag;
};

const isValidQuizName = async (name: String) => {
  const quiz = await Quiz.findOne({ name });
  if (!quiz) {
    return true;
  }
  return false;
};

export {
  createQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  isValidQuiz,
  isValidQuizName,
};

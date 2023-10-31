//model
import { RequestHandler } from "express";

import ProjectError from "../helper/error";
import Quiz from "../models/quiz";
import { ReturnResponse } from "../utils/interfaces";

const getallQuiz: RequestHandler = async (req, res, next) => {
    try {
        const quiz = await Quiz.find({ isPublished: true }, {
            name: 1,
            questionList: 1,
            createdBy: 1
        });
        if (!quiz) {
            const err = new ProjectError("No quiz found!");
            err.statusCode = 404;
            throw err;
        }
        const resp: ReturnResponse = {
            status: "success",
            message: "All Published Quiz",
            data: quiz,
        };
        res.status(200).send(resp);

    } catch (error) {
        next(error);
    }
};

export { getallQuiz };
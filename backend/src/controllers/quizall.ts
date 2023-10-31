//model
import { RequestHandler } from "express";
import Quiz from "../models/quiz";


const getallQuiz: RequestHandler = async (req, res, next) => {
    try {
        const quiz = await Quiz.find({ isPublished: true }, {
            name: 1,
            questionList: 1,
            createdBy: 1
        });
       
        
        res.status(200).send(quiz);

    } catch (error) {
        next(error);
    }
};

export { getallQuiz };
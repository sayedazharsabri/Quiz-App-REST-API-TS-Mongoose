//model
import {Request, Response} from 'express';

const createQuiz = (req:Request, res:Response) =>{
    res.send(req.body);
}

const getQuiz = (req:Request, res:Response) =>{
    res.send(req.params.quizId);
}

const updateQuiz = (req:Request, res:Response) =>{
    res.send(req.body);
}
const deleteQuiz = (req:Request, res:Response) =>{
    res.send(req.params.quizId);
}
const publishQuiz = (req:Request, res:Response) =>{
    res.send(req.body);
}


export {createQuiz, getQuiz, updateQuiz, deleteQuiz, publishQuiz};
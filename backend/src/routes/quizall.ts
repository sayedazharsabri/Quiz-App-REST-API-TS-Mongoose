import express from 'express';
import { getallQuiz } from '../controllers/quizall';


const router = express.Router();

//Get All published Quiz
router.get("/",  getallQuiz );


export default router;
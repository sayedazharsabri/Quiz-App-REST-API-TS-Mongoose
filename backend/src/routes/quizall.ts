import express from 'express';

import { getallQuiz } from '../controllers/quizall';
import { isAuthenticated } from '../middlewares/isAuth';

const router = express.Router();

//Get All published Quiz
router.get("/", isAuthenticated, getallQuiz );


export default router;
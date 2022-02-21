import express from 'express';
import { createQuiz, getQuiz, updateQuiz, deleteQuiz, publishQuiz } from '../controllers/quiz';
import { isAuthenticated } from '../middlewares/isAuth';


const router = express.Router();

// create
// POST /quiz/
router.post("/", isAuthenticated, createQuiz);

// get
// GET /quiz/:quizId
router.get("/:quizId", isAuthenticated, getQuiz);

//

//update
//PUT /quiz
router.put("/", isAuthenticated, updateQuiz);


//Delete
//DELETE quiz/:quizId
router.delete("/:quizId", isAuthenticated, deleteQuiz);

//Publish
// PATCH quiz/publish
router.patch("/publish", isAuthenticated, publishQuiz);



export default router;
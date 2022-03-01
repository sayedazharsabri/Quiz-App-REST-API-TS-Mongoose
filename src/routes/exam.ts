import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middlewares/isAuth";
import { startExam, submitExam } from "../controllers/exam";

// GET /exam/quizId
router.get("/:quizId", isAuthenticated, startExam);

// POST /exam
router.post("/", isAuthenticated, submitExam);

export default router;

import express from "express";
import { isAuthenticated } from "../middlewares/isAuth";

import { getReport } from "../controllers/report";

const router = express.Router();

//GET /report/:reportId
router.get("/:reportId?", isAuthenticated, getReport);

export default router;

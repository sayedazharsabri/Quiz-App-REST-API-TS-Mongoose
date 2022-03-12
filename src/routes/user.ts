// Redirect request to Particular method on Controller
import express from "express";
import {
  getUser,
  updateUser,
  activateUser,
  deactivateUser,
} from "../controllers/user";
import { isAuthenticated } from "../middlewares/isAuth";

const router = express.Router();

// User should be authenticate
// User should be authorize
//Get /user/:userId
router.get("/:userId", isAuthenticated, getUser);

// User should be authenticate
// User should be authorize
//Put /user/
router.put("/", isAuthenticated, updateUser);

//PATCH /user/deactivate
router.patch("/deactivate", isAuthenticated, deactivateUser);

//re-activate link
// GET /user/activate
router.get("/activate/:token", activateUser);

export default router;

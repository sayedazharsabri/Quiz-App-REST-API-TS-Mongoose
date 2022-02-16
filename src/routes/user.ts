// Redirect request to Particular method on Controller
import express from 'express';
import { getUser, updateUser } from '../controllers/user';
import { isAuthenticated } from '../middlewares/isAuth';

const router = express.Router();

// User should be authenticate
// User should be authorize
//Get /user/:userId
router.get('/:userId', isAuthenticated, getUser);

// User should be authenticate
// User should be authorize
//Put /user/
router.put('/', isAuthenticated, updateUser);



export default router;


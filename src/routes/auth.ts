// Redirect request to Particular method on Controller
import express from 'express';
import {registerUser, loginUser} from '../controllers/auth';

const router = express.Router();

// POST /auth/
router.post('/', registerUser);


// POST /auth/login
router.post('/login', loginUser);


export default router;

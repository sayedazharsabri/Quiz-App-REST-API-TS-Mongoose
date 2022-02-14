// Redirect request to Particular method on Controller
import express from 'express';
import {registerUser, getUser, updateUser, loginUser} from '../controllers/user';

const router = express.Router();

// POST /user/
router.post('/', registerUser);


// POST /user/login
router.post('/login', loginUser);


//Get /user/:userId
router.get('/:userId',getUser);


//Put /user/
router.put('/', updateUser);



export default router;


import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import  jwt from 'jsonwebtoken';

import { BadRequestError } from '@denizgirginer8/common';
import { validateRequest } from '@denizgirginer8/common';
import { Password } from '../services/password';
import { User } from '../models/User';

const router = express.Router();

router.post('/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must apply a password')
], validateRequest, async (req:Request, res:Response)=>{
    
    const { email, password } = req.body;

    const existUser = await User.findOne({email});

    if(!existUser){
        throw new BadRequestError('Invalid credientials..');
    }

    const passwordMatch = await Password.compare(existUser.password, password);

    if(!passwordMatch) {
        throw new BadRequestError('Invalid credientials..');
    }

    //generate jwt and store session
    const userJwt = jwt.sign({
        id:existUser.id,
        email:existUser.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    };

    return res.status(200).send(existUser);
    
});

export { router as signinRouter };
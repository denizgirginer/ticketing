import express from 'express';
import  { currentUser } from '@denizgirginer8/common';
import { requireAuth} from '@denizgirginer8/common';

const router = express.Router();

router.get('/currentuser', currentUser, /*requireAuth,*/ async (req, res)=>{
    res.send({currentUser:req.currentUser || null});
});

export { router as currentUserRouter };
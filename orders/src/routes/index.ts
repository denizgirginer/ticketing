import express, { Request, Response } from 'express';
import { requireAuth } from '@denizgirginer8/common';

import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

router.get('/', requireAuth, async(req:Request, res:Response)=> {
    
    const userId = req.currentUser?.id;

    const orders = await Order.find({
        userId
    }).populate('ticket');

    res.send(orders);
})

export { router as indexOrderRouter };

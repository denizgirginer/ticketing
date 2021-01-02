import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@denizgirginer8/common';

const router = express.Router();

router.get('/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId)
        .populate('ticket');

    if(!order) {
        throw new NotFoundError();
    } 

    if(order.userId!==req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
})

export { router as showOrderRouter };
import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@denizgirginer8/common';
import { Order } from '../models/order';
import { natsClient } from '../nats-client';
import { Ticket } from '../models/ticket';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';


const router = express.Router();

router.delete('/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if(order.userId!==req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish event
    await new OrderCancelledPublisher(natsClient.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })

    res.status(204).send(order);
})

export { router as deleteOrderRouter };

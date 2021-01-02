import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@denizgirginer8/common'
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../evetns/listeners/publishers/payment-created-publisher';
import { natsClient } from '../nats-client';

const router = express.Router();

router.post('/', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty(),
    validateRequest
], async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);


    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId != req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('cannot pay for cancelled order');
    }

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    })

    const payment = Payment.build({
        orderId,
        stripeId:charge.id
    })
    await payment.save();

    //publish event
    await new PaymentCreatedPublisher(natsClient.client).publish({
        orderId:payment.orderId,
        stripeId:payment.stripeId
    })

    res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter }
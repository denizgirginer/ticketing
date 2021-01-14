import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@denizgirginer8/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsClient } from '../nats-client';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = (60); //15*60 15 dk

router.post('/', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId is required'),
    /*body('price')
        .isFloat({gt:0})
        .withMessage('Price must be greater then 0')*/
        
], validateRequest, async (req:Request, res:Response)=>{
    const { ticketId } = req.body;
    
    //find the ticket the user is trying to order in database
    const ticket = await Ticket.findById(ticketId);
    
    if(!ticket){
        throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if(isReserved){
        throw new BadRequestError('Ticket already reserved ');
    }
    
    //calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOW_SECONDS)

    //build the order and save it to database
    const order = Order.build({
        expiresAt: expiration,
        status: OrderStatus.Created,
        ticket,
        userId: req.currentUser!.id
    });
    

    await order.save();

    //publish order created
    await new OrderCreatedPublisher(natsClient.client).publish({
        expiresAt: order.expiresAt.toISOString(), 
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price
        }
    })
    
    
    res.status(201).send(order);
})

export {router as createOrderRouter };
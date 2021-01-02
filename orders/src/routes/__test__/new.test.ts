import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import {  natsClient } from '../../nats-client';
import { OrderStatus } from '@denizgirginer8/common';

it('return an error if the ticket dos not exists', async ()=> {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404)
})

it('return error ticket already reserved', async ()=> {
    const ticket = Ticket.build({
        price:21,
        title:'consert'
    })
    await ticket.save();

    const order = Order.build({
        ticket,
        userId:'sdfsdf',
        status:OrderStatus.Created,
        expiresAt:new Date()
    })
    await order.save();

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({ticketId:ticket.id})
        .expect(400) 
})

it('reserves ticket', async ()=> {
    const ticket = Ticket.build({
        price:21,
        title:'consert'
    })
    await ticket.save();

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({ticketId:ticket.id})
        .expect(201) 
})

it('emit order created event', async()=>{

    const ticket = Ticket.build({
        price:21,
        title:'consert'
    })
    await ticket.save();

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({ticketId:ticket.id})
        .expect(201) 

    expect(natsClient.client.publish).toHaveBeenCalled();
})
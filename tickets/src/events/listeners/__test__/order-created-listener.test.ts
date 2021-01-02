import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from "@denizgirginer8/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsClient } from "../../../nats-client"
import { OrderCreatedListener } from "../order-created-listener"


const setup = async()=>{
    //create listener
    const listener = new OrderCreatedListener(natsClient.client);

    //create ticket
    const ticket = Ticket.build({
        price:23,
        title:'sdfs',
        userId: 'sdd'
    })
    await ticket.save();

    //fake data
    const data:OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        ticket: {
            id: ticket.id,
            price: ticket.price
        },
        userId: 'sdfsd',
        version: 0
    }

    //fake message
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg }
}

it('sets the orderId of the ticket', async()=>{
    const { listener,  ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);
})

it('ack() message', async()=>{
    const { listener,  ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('published a ticket updated event', async()=>{
    const { listener,  ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsClient.client.publish).toHaveBeenCalled();
})
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from "@denizgirginer8/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsClient } from "../../../nats-client"
import { OrderCancelledListener } from "../order-cancelled-listener"


const setup = async()=>{
    //create listener
    const listener = new OrderCancelledListener(natsClient.client);

    //create ticket
    const ticket = Ticket.build({
        price:23,
        title:'sdfs',
        userId: 'sdd'
    })
    ticket.orderId =  mongoose.Types.ObjectId().toHexString();
    await ticket.save();

    //fake data
    const data:OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,            
        }
    }

    //fake message
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, ticket, data, msg }
}

it('updates ticket and published and act()', async()=>{
    const { listener,  ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket?.orderId).not.toBeDefined();

    expect(msg.ack).toHaveBeenCalled();
    expect(natsClient.client.publish).toHaveBeenCalled();
})
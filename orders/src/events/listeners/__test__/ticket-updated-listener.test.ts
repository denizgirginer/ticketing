import { TicketUpdatedEvent } from "@denizgirginer8/common"
import { Message } from 'node-nats-streaming'
import mongoose from "mongoose"
import { natsClient } from "../../../nats-client"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    //create ticket
    const ticket = Ticket.build({
        title:'concert',
        price:2322,
        id: mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save();

    // create listener
    const listener = new TicketUpdatedListener(natsClient.client)
    
    // fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 23,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: ticket.version+1
    }

    // fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }
}

it('find and updates and saves ticket', async()=>{
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('ack() the message', async()=>{
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('does not call act the event wrong version', async()=>{
    const { listener, data, msg, ticket } = await setup();

    data.version=data.version+2;

    try {
        await listener.onMessage(data, msg);
    } catch(err) {
    }

    expect(msg.ack).not.toHaveBeenCalled()
})
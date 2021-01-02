import { TicketCreatedEvent } from "@denizgirginer8/common"
import { Message } from 'node-nats-streaming'
import mongoose from "mongoose"
import { natsClient } from "../../../nats-client"
import { TicketCreatedListener } from "../ticket-created-listener"
import { Ticket } from "../../../models/ticket"


const setup = async () => {
    // create listener
    const listener = new TicketCreatedListener(natsClient.client)
    // fake data event

    const data: TicketCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'sdf',
        price: 23,
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('created and save ticker', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with data + object
    await listener.onMessage(data, msg);

    // make assertions make sure ticket created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);
})

it('act the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with data + object
    await listener.onMessage(data, msg);

    // make assrtions act()
    expect(msg.ack).toHaveBeenCalled();
})
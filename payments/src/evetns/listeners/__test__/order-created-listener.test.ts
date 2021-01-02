import { OrderCreatedEvent, OrderStatus } from "@denizgirginer8/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { natsClient } from "../../../nats-client"
import { OrderCreatedListener } from "../order-created-listener"


const setup = async () => {

    const listener = new OrderCreatedListener(natsClient.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'sdf',
        userId: 'sdf',
        status: OrderStatus.Created,
        version: 0,
        ticket: {
            id: 'sdf',
            price: 10
        }
    };


    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }

}

it('replicates order info', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order.price).toEqual(data.ticket.price);
})

it('ack message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
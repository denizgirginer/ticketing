import mongoose from 'mongoose';
import { ExpirationCompleteEvent } from '@denizgirginer8/common';
import { Order, OrderStatus } from '../../../models/order';
import { Ticket } from '../../../models/ticket';
import { natsClient } from '../../../nats-client'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsClient.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        expiresAt: new Date(),
        userId: 'sdf',
        ticket,
    })
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, order, data, msg }
}

it('update the order status to cancel', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const savedOrder = await Order.findById(order.id)

    expect(savedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it('emit an orderCancelled event', async () => {
    const { listener, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsClient.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse(
        (natsClient.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toEqual(order.id)
})

it('act the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
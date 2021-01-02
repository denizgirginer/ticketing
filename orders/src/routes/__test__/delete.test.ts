import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import {  natsClient } from '../../nats-client';


it('it marks an order canccelled', async () => {
    const ticket = Ticket.build({
        title: 'sdfsdf',
        price: 23
    })
    await ticket.save();

    const user = global.signin();
    const { body: order } = await request(app)
        .post('/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: cancelledOrder } = await request(app)
        .delete(`/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it('emits update event', async()=>{
    const ticket = Ticket.build({
        title: 'sdfsdf',
        price: 23
    })
    await ticket.save();

    const user = global.signin();
    const { body: order } = await request(app)
        .post('/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201)

    const { body: cancelledOrder } = await request(app)
        .delete(`/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204)

    expect(natsClient.client.publish).toHaveBeenCalled();
})
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';


it('fetches order', async () => {
    const user = global.signin();

    const ticket = Ticket.build({
        title: 'sdfsdf',
        price: 33
    })
    await ticket.save();

    const { body: order } = await request(app)
        .post('/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
    expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
})


it('return err fetches order wrong user', async () => {
    const user = global.signin();

    const ticket = Ticket.build({
        title: 'sdfsdf',
        price: 33
    })
    await ticket.save();

    const { body: order } = await request(app)
        .post('/')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
    expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/${order.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401);

})

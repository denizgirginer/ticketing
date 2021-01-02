import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import {  natsClient } from '../../nats-client';

it('has a route handler listening to  /tickets', async () => {
    const response = await request(app)
        .post('/')
        .send({});

    expect(response.status).not.toEqual(404);

})

it('it can only access with user signed in', async () => {
    const response = await request(app)
        .post('/')
        .send({})
        .expect(401);
})

it('return a status other then 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({});

    console.log(response.status);

    expect(response.status).not.toEqual(401);
})


it('returns an error if an invalid title provided', async () => {
    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: -10
        })
        .expect(400);

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            price: 10
        })
        .expect(400);

})

it('return an error if invalid price provided ', async () => {
    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsdf',
            price: -10
        })
        .expect(400);
    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsdf',
        })
        .expect(400);
})

it('create ticket with valid inputs ', async () => {
    let tickets = await Ticket.find({});

    expect(tickets.length).toEqual(0);

    const title = 'sdfsdf';

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);
})

it('publishes an event', async()=>{
    const title = 'sdfsdf';

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201);

    expect(natsClient.client.publish).toHaveBeenCalled();
})
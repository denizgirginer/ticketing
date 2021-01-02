import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';
import { natsClient } from '../../nats-client';

it('return 404 if the provided not exists', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put('/' + id)
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsdf',
            price: 20
        })
        .expect(404);
})

it('return 401 if user not auth', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put('/' + id)
        .send({
            title: 'sdfsdf',
            price: 20
        })
        .expect(401);
})

it('return 401 if the user does not own ticket', async () => {
    const response = await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsdf',
            price: 20
        });

    await request(app)
        .put(`/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsdf',
            price: 21
        })
        .expect(401);
})

it('return 400 if the user provides invalid data', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/')
        .set('Cookie', cookie)
        .send({
            title: 'sdfsdf',
            price: 20
        });

    await request(app)
        .put('/' + response.body.id)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400)

    await request(app)
        .put('/' + response.body.id)
        .set('Cookie', cookie)
        .send({
            title: 'sdfsdf',
            price: -10
        })
        .expect(400)
})

it('updated ticket valid data', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/')
        .set('Cookie', cookie)
        .send({
            title: 'sdfsdf',
            price: 20
        });

    await request(app)
        .put('/'+response.body.id)
        .set('Cookie', cookie)
        .send({
            title:'new title',
            price:200
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get('/'+response.body.id)
        .send()

    expect(ticketResponse.body.title).toEqual('new title')
    expect(ticketResponse.body.price).toEqual(200)
})

it('event published', async()=>{
    const cookie = global.signin();
    const response = await request(app)
        .post('/')
        .set('Cookie', cookie)
        .send({
            title: 'sdfsdf',
            price: 20
        });

    await request(app)
        .put('/'+response.body.id)
        .set('Cookie', cookie)
        .send({
            title:'new title',
            price:200
        })
        .expect(200);

    expect(natsClient.client.publish).toHaveBeenCalled();
})

it('rejects update if ticket is reserved', async()=>{
    const cookie = global.signin();
    const response = await request(app)
        .post('/')
        .set('Cookie', cookie)
        .send({
            title: 'sdfsdf',
            price: 20
        });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId: mongoose.Types.ObjectId().toHexString()});
    ticket!.save();

    await request(app)
        .put('/'+response.body.id)
        .set('Cookie', cookie)
        .send({
            title:'new title',
            price:200
        })
        .expect(400);
})
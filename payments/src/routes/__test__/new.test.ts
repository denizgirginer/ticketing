import { OrderStatus } from '@denizgirginer8/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

//jest.mock('../../stripe');

it('return 404 when puchasing not exists order', async()=>{
    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            token:'sdfsdf',
            orderId: mongoose.Types.ObjectId().toHexString
        })
        expect(404)

});

it('return 401 when puchasing wrong user', async()=>{

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version:0,
        price:10,
        status:OrderStatus.Created,
        userId:mongoose.Types.ObjectId().toHexString()
    })
    await order.save();

    await request(app)
        .post('/')
        .set('Cookie', global.signin())
        .send({
            token:'sdfsdf',
            orderId: order.id
        })
        .expect(401)
});


it('return 400 when puchasing already cancelled order', async()=>{

    const userId = mongoose.Types.ObjectId().toHexString();

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version:0,
        price:10,
        status:OrderStatus.Cancelled,
        userId:userId
    })
    await order.save();

    await request(app)
        .post('/')
        .set('Cookie', global.signin(userId))
        .send({
            token:'sdfsdf',
            orderId: order.id
        })
        .expect(400)
});

it('returns 204 with valid inputs', async()=>{
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = await Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version:0,
        price:10,
        status:OrderStatus.Created,
        userId:userId
    })
    await order.save();

    await request(app)
    .post('/')
    .set('Cookie', global.signin(userId))
    .send({
        token:'tok_visa',
        orderId: order.id
    })
    .expect(201)

    const payment = await Payment.findOne({
        orderId:order.id
    })

    expect(payment).not.toBeNull()
})
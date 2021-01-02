import { OrderCancelledEvent, OrderStatus } from "@denizgirginer8/common";
import mongoose from 'mongoose';
import { Order } from "../../../models/order";
import { natsClient } from "../../../nats-client";
import { OrderCancelledListener } from "../order-cancelled-listener";



const setup = async () => {

    const listener = new OrderCancelledListener(natsClient.client);

    const order = Order.build({
        id:mongoose.Types.ObjectId().toHexString(),
        status:OrderStatus.Created,
        price:10,
        version:0,
        userId:'sdf'
    })
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version+1,
        ticket: {
            id: 'sdf',
        }
    };


    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, msg }

}

it('update the status order', async()=>{
    const { listener, data, msg, order} = await setup();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async()=>{
    const { listener, data, msg, order} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})
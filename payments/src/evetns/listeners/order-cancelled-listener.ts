import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@denizgirginer8/common'
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

import { queGroupName } from './que-group-name'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled=Subjects.OrderCancelled;
    queGroupName=queGroupName;
 
    async onMessage(data:OrderCancelledEvent['data'], msg:Message) {

        //get right version order
        const order = await Order.findOne( {
            _id:data.id,
            version:data.version-1
        });

        if(!order) {
            throw new Error('Order not found')
        }

        order.set({
            status:OrderStatus.Cancelled
        })
        await order.save();

        msg.ack();
    }
}
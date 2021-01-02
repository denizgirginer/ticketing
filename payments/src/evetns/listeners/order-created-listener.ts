import { Listener, OrderCreatedEvent, Subjects } from '@denizgirginer8/common'
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

import { queGroupName } from './que-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject:Subjects.OrderCreated=Subjects.OrderCreated;
    queGroupName=queGroupName;
 
    async onMessage(data:OrderCreatedEvent['data'], msg:Message) {

        const order = Order.build({
            id:data.id,
            price:data.ticket.price,
            status:data.status,
            userId:data.userId,
            version:data.version
        })
        await order.save();

        msg.ack();
    }
}
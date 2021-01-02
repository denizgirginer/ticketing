import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsClient } from '../../nats-client';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

import { queGroupName } from './que-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject:Subjects.ExpirationComplete=Subjects.ExpirationComplete;
    queGroupName=queGroupName;

    async onMessage(data:ExpirationCompleteEvent['data'], msg:Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw new Error('Order not found')
        }

        if(order.status==OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status:OrderStatus.Cancelled
        })        
        await order.save();

        await new OrderCancelledPublisher(natsClient.client).publish({
            id:order.id,
            version:order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    }
}
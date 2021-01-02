import { Listener, OrderCreatedEvent, Subjects } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { queGroupName } from './que-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queGroupName = queGroupName;

    async onMessage(data:OrderCreatedEvent['data'], msg:Message){
 
        const delay = new Date(data.expiresAt).getTime()- new Date().getTime();

        console.log("waiting delay:",delay);

        await expirationQueue.add({
            orderId:data.id
        }, {
            delay
        })

        msg.ack();
    }
}
import { Listener,  OrderCancelledEvent, Subjects } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queGroupName } from './que-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled=Subjects.OrderCancelled;
    queGroupName=queGroupName;

    async onMessage(data:OrderCancelledEvent['data'], msg:Message) {
        // find ticket
        const ticket = await Ticket.findById(data.ticket.id);

        // if no ticket throw error
        if(!ticket) {
            throw new Error('Ticket not found')
        }

        // mark ticket set orderId null
        ticket.set({orderId:undefined});
                
        // Save ticket
        await ticket.save();
        // every update need publish ticket
        await new TicketUpdatedPublisher(this.client).publish({
            price:ticket.price,
            title:ticket.title,
            userId:ticket.userId,
            version:ticket.version,
            id:ticket.id
        });

        //this service no need order table to store

        // ack the message
        msg.ack();
    }
}
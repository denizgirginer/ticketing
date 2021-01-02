import { Listener, OrderCreatedEvent, Subjects } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { queGroupName } from './que-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queGroupName = queGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        try {
            // find ticket
            console.log('ticketid::')
            console.log(data.ticket.id);
            const ticket = await Ticket.findById(data.ticket.id);

            // if no ticket throw error
            if (!ticket) {
                throw new Error('Ticket not found')
            }


            // mark ticket reserve set orderId
            ticket.set({ orderId: data.id });


            // Save ticket
            await ticket.save();
            // every update need publish ticket
            await new TicketUpdatedPublisher(this.client).publish({
                price: ticket.price,
                title: ticket.title,
                userId: ticket.userId,
                version: ticket.version,
                id: ticket.id,
                orderId: ticket.orderId
            });

            //this service no need order table to store

            // ack the message
            msg.ack();
        } catch (err) {
            console.log('order created listener error')
            //console.log(err.);
        }


    }
}
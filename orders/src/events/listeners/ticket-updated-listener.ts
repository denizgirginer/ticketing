import { Listener, Subjects, TicketUpdatedEvent } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queGroupName} from './que-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
    queGroupName = queGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg:Message ){
        const { id, title, price, version } = data;

        const ticket = await Ticket.findByEvent({
            id:data.id,
            version:data.version // here will query version = version-1 value
        });

        if(!ticket) {
            throw new Error('Ticket not found');
        }
        ticket.set({
            title, price
        })
        await ticket.save();

        msg.ack();

    }
}
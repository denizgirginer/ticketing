import { Listener, Subjects, TicketCreatedEvent } from '@denizgirginer8/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queGroupName} from './que-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
    queGroupName = queGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg:Message ){
        const { id, title, price } = data;

        const ticket = Ticket.build({
            title, price, id
        })
        await ticket.save();

        msg.ack();
    }
}
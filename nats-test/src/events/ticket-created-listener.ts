import nats, { Message, Stan } from 'node-nats-streaming';
import { Listener } from '@denizgirginer8/common';
import { Subjects } from '@denizgirginer8/common';
import { TicketCreatedEvent } from '@denizgirginer8/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queGroupName = 'payments-service';
    onMessage(data:TicketCreatedEvent['data'], msg:Message) {
        console.log('event data', data);

        console.log(data.id)
        console.log(data.title)
        
        msg.ack();
    }
}
import { Publisher } from '@denizgirginer8/common';
import { TicketCreatedEvent } from '@denizgirginer8/common';
import { Subjects } from '@denizgirginer8/common';

export class TickedCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject:Subjects.TicketCreated=Subjects.TicketCreated;
}
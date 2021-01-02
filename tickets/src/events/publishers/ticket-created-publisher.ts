import { Publisher, Subjects, TicketCreatedEvent } from '@denizgirginer8/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject:Subjects.TicketCreated=Subjects.TicketCreated;
    
}
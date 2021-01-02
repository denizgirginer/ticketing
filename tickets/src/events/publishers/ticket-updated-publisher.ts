import { Publisher, Subjects, TicketUpdatedEvent } from '@denizgirginer8/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject:Subjects.TicketUpdated=Subjects.TicketUpdated;
    
}
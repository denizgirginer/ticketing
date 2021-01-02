import { Publisher, Subjects, OrderCreatedEvent } from '@denizgirginer8/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject:Subjects.OrderCreated=Subjects.OrderCreated;
    
}
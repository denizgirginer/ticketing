import { Publisher, Subjects, OrderCancelledEvent } from '@denizgirginer8/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject:Subjects.OrderCancelled=Subjects.OrderCancelled;
    
}
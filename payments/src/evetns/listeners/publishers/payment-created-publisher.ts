import { Subjects, PaymentCreatedEvent, Publisher } from '@denizgirginer8/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
}
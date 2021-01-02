import { Subjects, Publisher, ExpirationCompleteEvent } from '@denizgirginer8/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject:Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
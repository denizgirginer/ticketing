import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@denizgirginer8/common'
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queGroupName} from './que-group-name'

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
    queGroupName = queGroupName;
    
    async onMessage(data:PaymentCreatedEvent['data'], msg:Message) {

        const order = await Order.findById(data.orderId).populate('ticket');

        if(!order) {
            throw Error('Order not found')
        }

        order.set({status: OrderStatus.Complete});
        await order.save();

        //no publish needed because order never update new version

        msg.ack();
    }
}
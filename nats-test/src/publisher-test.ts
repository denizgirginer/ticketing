import nats from 'node-nats-streaming';
import { TickedCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

// test connect to NATS
// kubectl port-forward nats-depl-574fb8d57b-bwzk9 4222:4222

const natsClient = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

natsClient.on('connect', async () => {
    console.log('publisher connects to NATS')

    const publisher = new TickedCreatedPublisher(natsClient);
    try {
        await publisher.publish({
            id: '213',
            title: 'concert',
            price: 21,
            userId: 'deniz'
        });
    } catch(err) {
        console.error(err);
    }
    
})
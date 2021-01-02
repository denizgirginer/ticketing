import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes }  from 'crypto';
import { TicketCreatedListener} from './events/ticket-created-listener'

console.clear();

// test connect to NATS
// kubectl port-forward nats-depl-574fb8d57b-bwzk9 8222:8222
// localhost:8222/streaming for monitoring NATS

const natsClient = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

natsClient.on('connect', ()=>{
    console.log('listener connected to NATS');

    natsClient.on('close', ()=>{
        console.log('NATS connection closed');
        process.exit(0);
    })

    new TicketCreatedListener(natsClient).listen();
})
  
//detect process exiting
//çalışmıyor --rs parametresi araştırılacak
//not work windows
process.on('SIGTERM', ()=>{
    try {
    natsClient.close();
    } catch(err) {
        console.log(err);
    }
})

process.on('SIGINT', ()=>{
    try {
    natsClient.close();
    } catch(err) {
        console.log(err);
    }
})


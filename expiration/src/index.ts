import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsClient } from './nats-client';

const start = async () => {
  console.log('starting gce...')
  if(!process.env.NATS_CLUSTER){
    throw new Error('NATS_CLUSTER not defined');
  }

  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID not defined');
  }

  if(!process.env.NATS_URL){
    throw new Error('NATS_URL not defined');
  }

  if(!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not defined')
  }

  try {
    await natsClient.connect(process.env.NATS_CLUSTER!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
 
    new OrderCreatedListener(natsClient.client).listen();

  } catch (err) {
    console.log(err);
  }
};


start();

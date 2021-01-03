import mongoose from 'mongoose';
import { app } from './app';
import { OrderCancelledListener } from './evetns/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './evetns/listeners/order-created-listener';
import { natsClient } from './nats-client';

const start = async () => {
  console.log('stargin gce ....');
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY not defined');
  }

  if(!process.env.MONGO_URI){
    throw new Error('MONGO_URI not defined');
  }

  if(!process.env.NATS_CLUSTER){
    throw new Error('NATS_CLUSTER not defined');
  }

  if(!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID not defined');
  }

  if(!process.env.NATS_URL){
    throw new Error('NATS_URL not defined');
  }

  try {  
    await natsClient.connect(process.env.NATS_CLUSTER!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
 
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log("connected to db...");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('listening port 3000...');
  });
};



start();

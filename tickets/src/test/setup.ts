import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import  request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
    namespace NodeJS {
        interface Global {
            signin():string[];
        }
    }
}

jest.mock('../nats-client');

let mongo:any;

//jest test works with jest:^25.0.0

beforeAll(async ()=>{
    process.env.JWT_KEY = "sdfsdf";
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
       useNewUrlParser:true,
       useUnifiedTopology:true 
    });
});

beforeEach(async ()=>{
    jest.clearAllMocks();
    
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = ()=>{
    //build a JWT payload {id, email}

    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email:'test@test.com'
    }
    //create JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build session object {jwt: MY_JWT}
    const session = { jwt: token};

    // turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    //Take JSON end encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //return as string that cookie  with data


    return [`express:sess=${base64}`];
}
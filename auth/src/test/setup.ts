import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import  request from 'supertest';

import { app } from '../app';

declare global {
    namespace NodeJS {
        interface Global {
            signin():Promise<string[]>;
        }
    }
}

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
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = async ()=>{
    const email = "deniz@deniz.com";
    const password = "sdsdf";

    const response = await request(app)
    .post('/signup')
    .send({email, password})
    .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;

}
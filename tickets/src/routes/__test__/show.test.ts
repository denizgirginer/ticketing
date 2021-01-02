import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';


it('test', ()=>{

});


it('return 404 if ticket is not found', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();

    await  request(app)
        .get(`/${id}`)
        .send()
        .expect(404);
})


it('return the ticket if is found', async ()=>{
    const title = "concert";
    const price = 20;

    const res = await request(app)
        .post('/')  
        .set('Cookie', global.signin())
        .send({
            title, price
        })
        .expect(201);

    
        
    const ticketRes = await request(app)
        .get(`/${res.body.id}`)
        .send()
        .expect(200);

    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);
    
})
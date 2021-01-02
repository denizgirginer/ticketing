import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exists', async()=>{
    await request(app)
        .post('/signin')
        .send({
            email:'test@test.com',
            password:'sdfsdf'
        })
        .expect(400);
})


it('fails when an incorrect password ', async()=>{
    await request(app)
        .post('/signup')
        .send({
            email:'deniz@deniz.com',
            password:'sdfsdf'
        })
        .expect(201);

    await request(app)
        .post('/signin')
        .send({
            email:'deniz@deniz.com',
            password:'sdfsdfx'
        })
        .expect(400);
})



it('response with a cookie when success signin ', async()=>{
    await request(app)
        .post('/signup')
        .send({
            email:'deniz@deniz.com',
            password:'sdfsdf'
        })
        .expect(201);

    const response = await request(app)
        .post('/signin')
        .send({
            email:'deniz@deniz.com',
            password:'sdfsdf'
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
})


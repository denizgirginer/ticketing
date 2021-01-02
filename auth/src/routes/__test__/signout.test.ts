import request from 'supertest';
import { app } from '../../app';


it('clears cookie after signout ', async()=>{
    await request(app)
        .post('/signup')
        .send({
            email:'deniz@deniz.com',
            password:'sdfsdf'
        })
        .expect(201);

    const response = await request(app)
        .post('/signout')
        .expect(200);

    console.log(response.get('Set-Cookie'))
    expect(response.get('Set-Cookie')[0])
    .toEqual('express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
})


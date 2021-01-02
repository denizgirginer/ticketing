import request from 'supertest';
import { app } from '../../app';


it('response with details current user ', async()=>{
    const cookie = await global.signin();
    
    const response = await request(app)
        .get('/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(400);

    expect(response.body.currentUser.email).toEqual('deniz@deniz.com');
    
})



it('response with null current user if not authenticated ', async()=>{
    
    const response = await request(app)
        .get('/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toBeNull();
    
})
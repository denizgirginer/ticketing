import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on success signup', async () => {
    return request(app)
        .post('/signup')
        .send({
            email: 'deniz@deniz.com',
            password: '33434'
        })
        .expect(201)
})

it('returns a 400 with invalid invalid email', async () => {
    return request(app)
        .post('/signup')
        .send({
            email: 'denizdeniz.com',
            password: '33434'
        })
        .expect(400)
})

it('returns a 400 with invalid invalid password', async () => {
    return request(app)
        .post('/signup')
        .send({
            email: 'deniz@deniz.com',
            password: '34'
        })
        .expect(400)
})


it('returns a 400 with missing email password', async () => {
    await request(app)
        .post('/signup')
        .send({
            email: 'sdfsdf@sdf'
        })
        .expect(400)

    await request(app)
        .post('/signup')
        .send({
            password: '^234234'
        })
        .expect(400)
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/signup')
        .send({
            email: 'test@test.com',
            password: '234234'
        })
        .expect(201)

    await request(app)
        .post('/signup')
        .send({
            email: 'test@test.com',
            password: '234234'
        })
        .expect(400)

})

//app.use cookieSession must secure:false
it('set a cookie succesfuly signup', async()=>{
    const response = await request(app)
        .post('/signup')
        .send({
            email: 'test@test.com',
            password: '234234'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})
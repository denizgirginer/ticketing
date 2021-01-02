import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const createTicket = ()=> {
    return request(app)
    .post('/')
    .set('Cookie', global.signin())
    .send({
        title: 'Dsdfsdf',
        price: 23
    })
}

it('can fetch list of tickets', async () => {

    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
})
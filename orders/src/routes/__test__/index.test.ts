import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'consert',
        price: 23
    })
    await ticket.save();
    return ticket;
}

it('can fetch list of orders for user', async () => {
    const ticket1 = await createTicket();
    const ticket2 = await createTicket();
    const ticket3 = await createTicket();

    const user1 = global.signin();
    const user2 = global.signin();

    //user1
    await request(app)
        .post('/')
        .set('Cookie', user1)
        .send({ ticketId: ticket1.id })
        .expect(201)

    //user2
    const {body:order1} = await request(app)
        .post('/')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201)

    //get orders user2
    const {body:order2} = await request(app)
        .post('/')
        .set('Cookie', user2)
        .send({ ticketId: ticket3.id })
        .expect(201)

    const {body:items} = await request(app)
        .get('/')
        .set('Cookie',user2)
        .expect(200);

    expect(items.length).toEqual(2);
    expect(items[0].id).toEqual(order1.id);
    expect(items[1].id).toEqual(order2.id);

    expect(items[0].ticket.id).toEqual(ticket2.id);
    expect(items[1].ticket.id).toEqual(ticket3.id);
    
})
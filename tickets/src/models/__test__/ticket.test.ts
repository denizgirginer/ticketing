import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done)=> {

    //create new ticket
    const ticket = Ticket.build({
        title: 'sdfsdf',
        price:2,
        userId:'2134'
    })

    await ticket.save();

    const firstTicket = await Ticket.findById(ticket.id);
    const secondTicket = await Ticket.findById(ticket.id);

    console.log('version:::',secondTicket?.version);

    firstTicket!.set({price:10})
    secondTicket?.set({price:15})

    await firstTicket?.save();
    

    try {
        await secondTicket?.save();
    } catch(err) {
        return done();
    }
    
    throw new Error('should not reach this point')
})

it('increments version nmultiple save', async()=>{

    const ticket = Ticket.build({
        title:'sdfsdf',
        price:343,
        userId:'sdf'
    })

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
})
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@denizgirginer8/common';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        throw new NotFoundError();
    } 

    res.send(ticket);
})

export { router as showTicketRouter };
import express, { Request } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@denizgirginer8/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index'
import { updateRouter } from './routes/update';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: false //process.env.NODE_ENV!=='test
}))
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateRouter);

app.all("*", async (req:Request, res, next) => {
  console.log(req.url);
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };

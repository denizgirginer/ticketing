import express, { Request } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@denizgirginer8/common';

import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: false //process.env.NODE_ENV!=='test
}))
app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req:Request, res, next) => {
  console.log(req.url);
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };

import express, { Request } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@denizgirginer8/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: false //process.env.NODE_ENV!=='test
}))

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('/createOrder', (req,res)=>{
  return res.send('order created')
})

app.all("*", async (req:Request, res, next) => {
  console.log(req.url);
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };
